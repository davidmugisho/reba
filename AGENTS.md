# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.

This project is on **SDK 54**, not the latest. That is deliberate: Expo Go ships
a single SDK at a time, and staying on 54 is what lets the app be opened from
Expo Go on the phones it is developed against. Do not bump the SDK to make a
package happy.

`npx expo install --check` is the authority on dependency versions, not npm's
latest. A package that npm is happy to install can still be unusable, because
its native half has to already be inside Expo Go.
