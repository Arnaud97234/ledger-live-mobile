// @flow
import React from "react";
import { StyleSheet } from "react-native";
import {
  CantOpenDevice,
  WrongDeviceForAccount,
  PairingFailed,
  UserRefusedAllowManager,
} from "@ledgerhq/errors";
import Rounded from "./Rounded";
import IconNanoX from "../icons/NanoX";
import Close from "../icons/Close";
import ErrorBadge from "./ErrorBadge";
import Circle from "./Circle";
import colors, { lighten } from "../colors";
import BluetoothScanning from "./BluetoothScanning";
import ErrorCrossBadge from "./ErrorCrossBadge";

type Props = {
  error: ?Error,
};

export default function ErrorIcon({ error }: Props) {
  if (!error) return null;
  if (typeof error !== "object") {
    // this case should not happen (it is supposed to be a ?Error)
    console.error(`ErrorIcon invalid usage: ${String(error)}`);
    return null;
  }

  if (error instanceof UserRefusedAllowManager) {
    return (
      <Rounded bg={colors.pillActiveBackground}>
        <IconNanoX color={colors.live} height={36} width={8} />
        <ErrorCrossBadge style={styles.badge} />
      </Rounded>
    );
  }

  if (error instanceof PairingFailed) {
    return <BluetoothScanning isError />;
  }

  if (
    error instanceof CantOpenDevice ||
    error instanceof WrongDeviceForAccount
  ) {
    return (
      <Rounded bg={lighten(colors.alert, 0.75)}>
        <IconNanoX color={colors.alert} height={36} width={8} />
        <ErrorBadge style={styles.badge} />
      </Rounded>
    );
  }

  return (
    <Circle size={80} bg={lighten(colors.alert, 0.75)}>
      <Close size={40} color={colors.alert} />
    </Circle>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    width: 32,
    height: 32,
  },
});
