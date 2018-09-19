// @flow

import React, { PureComponent } from "react";
import { StyleSheet, Animated, TouchableWithoutFeedback } from "react-native";
import { translate } from "react-i18next";
import Icon from "react-native-vector-icons/dist/Feather";
import ElevatedView from "./ElevatedView";
import colors from "../colors";
import LText from "./LText";

class ImportedAccountsNotification extends PureComponent<
  {
    t: *,
  },
  {
    progress: Animated.Value,
    finished: boolean,
  },
> {
  state = {
    progress: new Animated.Value(0),
    finished: false,
  };

  timeout: *;

  componentDidMount() {
    Animated.timing(this.state.progress, {
      toValue: 1,
      duration: 500,
    }).start();
    this.timeout = setTimeout(this.finish, 3000);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  finish = () => {
    clearTimeout(this.timeout);
    Animated.timing(this.state.progress, {
      toValue: 0,
      duration: 1000,
    }).start(finished => {
      if (finished) this.setState({ finished: true });
    });
  };

  render() {
    const { t } = this.props;
    const { progress, finished } = this.state;
    if (finished) return null;
    return (
      <Animated.View
        style={[StyleSheet.absoluteFill, styles.root, { opacity: progress }]}
      >
        <TouchableWithoutFeedback onPress={this.finish}>
          <ElevatedView style={styles.container} elevation={3}>
            <Icon name="check-circle" color={colors.white} size={28} />
            <LText semiBold style={styles.text} numberOfLines={2}>
              {t("accounts.importNotification.message")}
            </LText>
          </ElevatedView>
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    padding: 10,
    zIndex: 10,
  },
  container: {
    backgroundColor: colors.success,
    borderRadius: 5,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    marginLeft: 16,
    color: colors.white,
  },
});

export default translate()(ImportedAccountsNotification);