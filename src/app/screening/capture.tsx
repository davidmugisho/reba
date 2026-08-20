import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Body, Button, Eyebrow, Screen, StepDots, Title } from '../../components/reba-kit';
import { useScreening } from '../../context/ScreeningContext';
import { useT } from '../../i18n';
import { persistCapture } from '../../storage/photos';
import type { Eye } from '../../types/screening';
import { color, radius, space, TAP, type } from '../../theme';

/**
 * One photo per eye, flash on, at arm's length.
 *
 * The shot goes straight from the camera's cache into permanent storage and
 * the record keeps the permanent path — see src/storage/photos.ts for why the
 * cache is not good enough.
 *
 * A capture that fails to save is not recorded. The eye stays unticked and the
 * health worker is told, because a record listing two photos that are not on
 * the phone is worse than one that admits it has none.
 */
export default function Capture() {
  const router = useRouter();
  const { draft, update } = useScreening();
  const t = useT();

  const [permission, requestPermission] = useCameraPermissions();
  const camera = useRef<CameraView | null>(null);
  const [eye, setEye] = useState<Eye>('right');
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const shotFor = (which: Eye) => draft.captures.find((c) => c.eye === which);
  const bothDone = !!shotFor('left') && !!shotFor('right');
  const existing = shotFor(eye);

  async function shoot() {
    if (busy || !camera.current) return;
    setBusy(true);
    setFailed(false);

    try {
      const photo = await camera.current.takePictureAsync({ quality: 0.85 });
      if (!photo?.uri) throw new Error('the camera returned no image');

      // Out of the cache before it goes anywhere near the record.
      const uri = persistCapture(photo.uri, draft.id, eye);

      update({
        captures: [
          ...draft.captures.filter((c) => c.eye !== eye),
          { eye, uri, capturedAt: new Date().toISOString() },
        ],
      });
      if (eye === 'right') setEye('left');
    } catch (cause) {
      console.warn('[reba] could not keep the photo', cause);
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  // ------------------------------------------------------------- permission
  if (!permission) {
    return (
      <Screen>
        <Body muted>{t.common.loading}</Body>
      </Screen>
    );
  }

  if (!permission.granted) {
    const canAsk = permission.canAskAgain;
    return (
      <Screen
        footer={
          canAsk ? (
            <Button label={t.capture.permissionGrant} onPress={() => requestPermission()} />
          ) : undefined
        }
      >
        <StepDots current={3} total={6} />
        <Eyebrow>{t.capture.step}</Eyebrow>
        <Title>{t.capture.permissionTitle}</Title>
        <Body muted>{canAsk ? t.capture.permissionBody : t.capture.permissionDenied}</Body>
      </Screen>
    );
  }

  // ----------------------------------------------------------------- camera
  return (
    <Screen
      footer={
        <>
          {failed ? <Text style={s.failure}>{t.capture.saveFailed}</Text> : null}
          {bothDone ? (
            <Button label={t.capture.analyse} onPress={() => router.push('/screening/analysis')} />
          ) : (
            <Button
              label={eye === 'right' ? t.capture.captureRight : t.capture.captureLeft}
              onPress={shoot}
              disabled={busy}
            />
          )}
          {existing ? (
            <Button label={t.capture.retake} variant="secondary" onPress={shoot} disabled={busy} />
          ) : null}
        </>
      }
    >
      <StepDots current={3} total={6} />
      <Eyebrow>{t.capture.step}</Eyebrow>
      <Title>
        {bothDone
          ? t.capture.bothDone
          : eye === 'right'
            ? t.capture.titleRight
            : t.capture.titleLeft}
      </Title>
      <Body muted>{t.capture.lead}</Body>

      <View style={s.viewfinder}>
        {existing ? (
          <Image source={{ uri: existing.uri }} style={s.shot} resizeMode="cover" />
        ) : (
          <CameraView
            ref={camera}
            style={s.camera}
            facing="back"
            flash="on"
            animateShutter={false}
            testID="camera"
          />
        )}
        {/* The ring is what the health worker fills with the eye. */}
        <View pointerEvents="none" style={s.ringWrap}>
          <View style={s.ring} />
        </View>
      </View>

      <View style={s.status}>
        <EyeChip label={t.capture.rightEye} done={!!shotFor('right')} active={eye === 'right'} />
        <EyeChip label={t.capture.leftEye} done={!!shotFor('left')} active={eye === 'left'} />
      </View>
    </Screen>
  );
}

function EyeChip({ label, done, active }: { label: string; done: boolean; active: boolean }) {
  return (
    <View style={[s.chip, done && s.chipDone, active && !done && s.chipActive]}>
      <Text style={[s.chipLabel, done && { color: color.clear }]}>
        {done ? '✓ ' : ''}
        {label}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  viewfinder: {
    aspectRatio: 3 / 4,
    borderRadius: radius.lg,
    backgroundColor: color.ink,
    overflow: 'hidden',
  },
  camera: { flex: 1 },
  shot: { flex: 1 },
  ringWrap: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  ring: {
    width: '55%',
    aspectRatio: 1,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: color.accent,
  },
  status: { flexDirection: 'row', gap: space.sm },
  chip: {
    flex: 1,
    paddingVertical: space.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: color.line,
    alignItems: 'center',
    minHeight: TAP,
    justifyContent: 'center',
  },
  chipActive: { borderColor: color.accent },
  chipDone: { borderColor: color.clear, backgroundColor: color.clearSoft },
  chipLabel: { ...type.body, fontWeight: '600', color: color.ink },
  failure: {
    ...type.body,
    color: color.refer,
    fontWeight: '600',
    borderWidth: 1.5,
    borderColor: color.refer,
    borderRadius: radius.md,
    padding: space.md,
  },
});
