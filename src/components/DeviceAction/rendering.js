// @flow
import React from "react";
import { View, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/dist/Feather";
import { WrongDeviceForAccount, UnexpectedBootloader } from "@ledgerhq/errors";
import type { TokenCurrency } from "@ledgerhq/live-common/lib/types";
import type { Device } from "@ledgerhq/live-common/lib/hw/actions/types";
import LText from "../LText";
import getWindowDimensions from "../../logic/getWindowDimensions";
import Spinning from "../Spinning";
import BigSpinner from "../../icons/BigSpinner";
import colors, { lighten } from "../../colors";
import Button from "../Button";
import { NavigatorName } from "../../const";
import Animation from "../Animation";
import getDeviceAnimation from "./getDeviceAnimation";
import GenericErrorView from "../GenericErrorView";
import Circle from "../Circle";

type RawProps = {
  t: (key: string, options?: { [key: string]: string }) => string,
};

export function renderRequestQuitApp({
  t,
  device,
}: {
  ...RawProps,
  device: Device,
}) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.animationContainer}>
        <Animation source={getDeviceAnimation({ device, key: "quitApp" })} />
      </View>
      <LText style={styles.text} semiBold>
        {t("DeviceAction.quitApp")}
      </LText>
    </View>
  );
}

export function renderRequiresAppInstallation({
  t,
  navigation,
  appName,
}: {
  ...RawProps,
  navigation: any,
  appName: string,
}) {
  return (
    <View style={styles.wrapper}>
      <LText style={styles.text} semiBold>
        {t("DeviceAction.appNotInstalled", { appName })}
      </LText>
      <View style={styles.actionContainer}>
        <Button
          event="DeviceActionRequiresAppInstallationOpenManager"
          type="primary"
          title={t("DeviceAction.button.openManager")}
          onPress={() => navigation.navigate(NavigatorName.Manager)}
          containerStyle={styles.button}
        />
      </View>
    </View>
  );
}

export function renderVerifyAddress({
  t,
  device,
  currencyName,
  onPress,
  address,
}: {
  ...RawProps,
  device: Device,
  currencyName: string,
  onPress?: () => void,
  address?: string,
}) {
  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.animationContainer,
          device.modelId !== "blue" ? styles.verifyAddress : undefined,
        ]}
      >
        <Animation source={getDeviceAnimation({ device, key: "validate" })} />
      </View>
      <LText style={[styles.text, styles.title]} semiBold>
        {t("DeviceAction.verifyAddress.title")}
      </LText>
      <LText style={[styles.text, styles.description]}>
        {t("DeviceAction.verifyAddress.description", { currencyName })}
      </LText>
      <View style={styles.actionContainer}>
        {onPress && (
          <Button
            event="DeviceActionVerifyAddress"
            type="primary"
            title={t("common.continue")}
            onPress={onPress}
            containerStyle={styles.button}
          />
        )}
        {address && (
          <View>
            <LText bold style={[styles.text, styles.title]}>
              {address}
            </LText>
          </View>
        )}
      </View>
    </View>
  );
}

export function renderAllowManager({
  t,
  wording,
  device,
}: {
  ...RawProps,
  wording: string,
  device: Device,
}) {
  // TODO: disable gesture, modal close, hide header buttons
  return (
    <View style={styles.wrapper}>
      <View style={styles.animationContainer}>
        <Animation
          source={getDeviceAnimation({ device, key: "allowManager" })}
        />
      </View>
      <LText style={styles.text} semiBold>
        {t("DeviceAction.allowManagerPermission", { wording })}
      </LText>
    </View>
  );
}

export function renderAllowOpeningApp({
  t,
  navigation,
  wording,
  tokenContext,
  isDeviceBlocker,
  device,
}: {
  ...RawProps,
  navigation: any,
  wording: string,
  tokenContext?: ?TokenCurrency,
  isDeviceBlocker?: boolean,
  device: Device,
}) {
  if (isDeviceBlocker) {
    // TODO: disable gesture, modal close, hide header buttons
    navigation.setOptions({
      gestureEnabled: false,
    });
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.animationContainer}>
        <Animation source={getDeviceAnimation({ device, key: "openApp" })} />
      </View>
      <LText style={styles.text} semiBold>
        {t("DeviceAction.allowAppPermission", { wording })}
      </LText>
      {tokenContext ? (
        <LText style={styles.text} semiBold>
          {t("DeviceAction.allowAppPermissionSubtitleToken", {
            token: tokenContext.name,
          })}
        </LText>
      ) : null}
    </View>
  );
}

export function renderInWrongAppForAccount({
  t,
  onRetry,
  accountName,
}: {
  ...RawProps,
  accountName: string,
  onRetry?: () => void,
}) {
  return renderError({
    t,
    error: new WrongDeviceForAccount(null, { accountName }),
    onRetry,
  });
}

export function renderError({
  t,
  error,
  onRetry,
}: {
  ...RawProps,
  error: Error,
  onRetry?: () => void,
}) {
  return (
    <View style={styles.wrapper}>
      <GenericErrorView error={error} withDescription withIcon />
      {onRetry && (
        <View style={styles.actionContainer}>
          <Button
            event="DeviceActionErrorRetry"
            type="primary"
            title={t("common.retry")}
            onPress={onRetry}
            containerStyle={styles.button}
          />
        </View>
      )}
    </View>
  );
}

export function renderConnectYourDevice({
  t,
  unresponsive,
  device,
}: {
  ...RawProps,
  unresponsive: boolean,
  device: Device,
}) {
  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.animationContainer,
          device.modelId !== "blue" ? styles.connectDeviceContainer : undefined,
        ]}
      >
        <Animation
          source={getDeviceAnimation({
            device,
            key: unresponsive ? "enterPinCode" : "plugAndPinCode",
          })}
        />
      </View>
      <LText style={styles.text} semiBold>
        {t(
          unresponsive
            ? "DeviceAction.unlockDevice"
            : device.wired
            ? "DeviceAction.connectAndUnlockDevice"
            : "DeviceAction.turnOnAndUnlockDevice",
        )}
      </LText>
    </View>
  );
}

export function renderLoading({
  t,
  description,
}: {
  ...RawProps,
  description?: string,
}) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.spinnerContainer}>
        <Spinning>
          <BigSpinner />
        </Spinning>
      </View>
      <LText semiBold style={styles.text}>
        {description ?? t("DeviceAction.loading")}
      </LText>
    </View>
  );
}

type WarningOutdatedProps = {
  ...RawProps,
  navigation: any,
  appName: string,
  passWarning: () => void,
};

export function renderWarningOutdated({
  t,
  navigation,
  appName,
  passWarning,
}: WarningOutdatedProps) {
  function onOpenManager() {
    navigation.navigate(NavigatorName.Manager);
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.iconContainer}>
        <Circle size={60} bg={lighten(colors.yellow, 0.4)}>
          <Icon size={28} name="alert-triangle" color={colors.yellow} />
        </Circle>
      </View>

      <LText style={[styles.text, styles.title]} bold>
        {t("DeviceAction.outdated")}
      </LText>
      <LText style={[styles.text, styles.description]} semiBold>
        {t("DeviceAction.outdatedDesc", { appName })}
      </LText>
      <View style={styles.actionContainer}>
        <Button
          event="DeviceActionWarningOutdatedOpenManager"
          type="primary"
          title={t("DeviceAction.button.openManager")}
          onPress={onOpenManager}
          containerStyle={styles.button}
        />
        <Button
          event="DeviceActionWarningOutdatedContinue"
          type="secondary"
          title={t("common.continue")}
          onPress={passWarning}
          outline={false}
          containerStyle={styles.button}
        />
      </View>
    </View>
  );
}

export function renderBootloaderStep({ t }: RawProps) {
  return renderError({
    t,
    error: new UnexpectedBootloader(),
  });
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 160,
  },
  anim: {
    width: getWindowDimensions().width - 2 * 16,
  },
  text: {
    color: colors.darkBlue,
    textAlign: "center",
  },
  iconContainer: {
    margin: 16,
  },
  title: {
    padding: 8,
    fontSize: 16,
  },
  description: {
    color: colors.grey,
    padding: 8,
  },
  spinnerContainer: {
    padding: 24,
  },
  button: {
    margin: 8,
  },
  actionContainer: {
    alignSelf: "stretch",
  },
  animationContainer: {
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
  },
  connectDeviceContainer: {
    height: 100,
  },
  verifyAddress: {
    height: 72,
  },
});
