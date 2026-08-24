import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { bothEyesLine } from '../../acuity';
import { Body, Button, Card, Screen, Title } from '../../components/reba-kit';
import { useT } from '../../i18n';
import { deleteScreeningPhotos } from '../../storage/photos';
import { deleteScreening, getScreening } from '../../storage/screenings';
import type { EyeCapture, RiskLevel, Screening } from '../../types/screening';
import { color, radius, space, TAP, type } from '../../theme';

/**
 * One saved screening, in full.
 *
 * The photos are shown here because until the model lands this is the only
 * thing that looks at them. A nurse handed a referral can open the record and
 * see the eyes that were photographed, which is worth something today with no
 * model at all.
 *
 * Deleting is offered because the consent script promises the patient they can
 * stop at any point, and that promise should not expire the moment the record
 * is written.
 */
export default function ScreeningDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const t = useT();
  const outcome: Record<RiskLevel, string> = {
    clear: t.history.bandClear,
    monitor: t.history.bandMonitor,
    refer: t.history.bandRefer,
  };
  const [item, setItem] = useState<Screening | null | undefined>(undefined);
  const [confirming, setConfirming] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (id) getScreening(id).then(setItem);
  }, [id]);

  async function remove() {
    if (!item) return;
    setFailed(false);
    try {
      await deleteScreening(item.id);
      // Only once the record is gone: a photo deleted while the record
      // survives would leave a screening pointing at nothing.
      deleteScreeningPhotos(item.id);
      router.back();
    } catch (cause) {
      console.warn('[reba] could not delete the screening', cause);
      setFailed(true);
      setConfirming(false);
    }
  }

  if (item === undefined) return <Screen><Body muted>{t.common.loading}</Body></Screen>;
  if (item === null) return <Screen><Title>{t.history.notFound}</Title></Screen>;

  const shot = (eye: 'right' | 'left'): EyeCapture | undefined =>
    item.captures.find((c) => c.eye === eye);

  return (
    <Screen>
      <Title>{new Date(item.createdAt).toLocaleString()}</Title>
      <Card>
        <Row
          label={t.referral.age}
          value={item.patient.ageYears ? t.history.years(item.patient.ageYears) : t.common.none}
        />
        <Row label={t.referral.village} value={item.patient.village || t.common.none} />
        <Row label={t.referral.referTo} value={item.patient.facilityCode || t.common.none} />
        <Row
          label={t.referral.acuity}
          value={bothEyesLine(item.acuity, t.acuity.eyeReading, t.common.none)}
        />
        <Row
          label={t.referral.outcome}
          value={item.risk ? outcome[item.risk] : t.common.none}
        />
      </Card>

      {item.triage ? <Text style={s.reason}>{t.result.reason(item.triage.reason)}</Text> : null}

      {item.captures.length > 0 ? (
        <>
          <Text style={s.label}>{t.history.photosLabel}</Text>
          <View style={s.photos}>
            <EyePhoto label={t.acuity.rightEye} capture={shot('right')} missing={t.history.photoMissing} />
            <EyePhoto label={t.acuity.leftEye} capture={shot('left')} missing={t.history.photoMissing} />
          </View>
        </>
      ) : null}

      {/* The measured numbers, not just the verdict. A threshold set on a
          handful of photographs needs to be checkable against every new one. */}
      {item.reflex ? (
        <>
          <Text style={s.label}>{t.history.reflexLabel}</Text>
          <Text style={s.reflexReading}>
            {t.history.reflexReading(
              item.reflex.right.redness,
              item.reflex.left.redness,
              item.reflex.finding,
            )}
          </Text>
        </>
      ) : null}

      {item.notes ? (
        <>
          <Text style={s.label}>{t.common.notes}</Text>
          <Body>{item.notes}</Body>
        </>
      ) : null}

      <View style={s.danger}>
        {failed ? <Text style={s.failure}>{t.history.deleteFailed}</Text> : null}

        {confirming ? (
          <Card style={s.confirm}>
            <Text style={s.confirmTitle}>{t.history.deleteConfirmTitle}</Text>
            <Body muted>{t.history.deleteConfirmBody}</Body>
            <View style={s.confirmActions}>
              <View style={s.confirmAction}>
                <Button label={t.history.deleteNo} variant="secondary" onPress={() => setConfirming(false)} />
              </View>
              <View style={s.confirmAction}>
                <Pressable
                  accessibilityRole="button"
                  onPress={remove}
                  style={({ pressed }) => [s.destructive, pressed && { opacity: 0.85 }]}
                >
                  <Text style={s.destructiveLabel}>{t.history.deleteYes}</Text>
                </Pressable>
              </View>
            </View>
          </Card>
        ) : (
          <Pressable
            accessibilityRole="button"
            onPress={() => setConfirming(true)}
            style={({ pressed }) => [s.deleteLink, pressed && { backgroundColor: color.referSoft }]}
          >
            <Text style={s.deleteLinkLabel}>{t.history.delete}</Text>
          </Pressable>
        )}
      </View>
    </Screen>
  );
}

/** Falls back to a note rather than a broken frame: the file can be gone. */
function EyePhoto({
  label,
  capture,
  missing,
}: {
  label: string;
  capture?: EyeCapture;
  missing: string;
}) {
  return (
    <View style={s.photo}>
      <Text style={s.photoLabel}>{label}</Text>
      {capture ? (
        <Image source={{ uri: capture.uri }} style={s.photoImage} resizeMode="cover" />
      ) : (
        <View style={[s.photoImage, s.photoMissing]}>
          <Text style={s.photoMissingText}>{missing}</Text>
        </View>
      )}
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.row}>
      <Text style={s.rowLabel}>{label}</Text>
      <Text style={s.rowValue}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: space.md },
  rowLabel: { ...type.label, color: color.inkMuted },
  rowValue: { ...type.body, fontWeight: '600', color: color.ink, flexShrink: 1, textAlign: 'right' },
  reason: { ...type.body, fontWeight: '600', color: color.ink },
  reflexReading: { ...type.body, fontSize: 13, color: color.inkMuted },
  label: { ...type.label, color: color.inkMuted, marginTop: space.sm },

  photos: { flexDirection: 'row', gap: space.sm },
  photo: { flex: 1, gap: space.xs },
  photoLabel: { ...type.body, fontSize: 13, color: color.inkMuted },
  photoImage: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: radius.md,
    backgroundColor: color.raised,
  },
  photoMissing: { alignItems: 'center', justifyContent: 'center', padding: space.sm },
  photoMissingText: { ...type.body, fontSize: 13, color: color.inkFaint, textAlign: 'center' },

  danger: { marginTop: space.lg, gap: space.sm },
  deleteLink: {
    minHeight: TAP,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },
  deleteLinkLabel: { ...type.body, fontWeight: '600', color: color.refer },
  confirm: { borderColor: color.refer, backgroundColor: color.referSoft, gap: space.sm },
  confirmTitle: { ...type.heading, color: color.refer },
  confirmActions: { flexDirection: 'row', gap: space.sm, marginTop: space.xs },
  confirmAction: { flex: 1 },
  destructive: {
    minHeight: TAP,
    borderRadius: radius.md,
    backgroundColor: color.refer,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.md,
  },
  destructiveLabel: { ...type.heading, color: color.onDark },
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
