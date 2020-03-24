// @flow

import React, { useCallback } from "react";
import { Linking } from "react-native";
import { translate } from "react-i18next";
import type { TFunction } from "react-i18next";
import {
  getDefaultExplorerView,
  getAddressExplorer,
} from "@ledgerhq/live-common/lib/explorers";
import {
  formatVotes,
  useTronSuperRepresentatives,
} from "@ledgerhq/live-common/lib/families/tron/react";
import type { Vote } from "@ledgerhq/live-common/lib/families/tron/types";
import type { Account, Operation } from "@ledgerhq/live-common/lib/types";
import Section from "../../screens/OperationDetails/Section";

const helpURL = "https://support.ledger.com/hc/en-us/articles/360010653260";

function getURLWhatIsThis(op: Operation): ?string {
  if (op.type !== "IN" && op.type !== "OUT") {
    return helpURL;
  }
}

interface OperationsDetailsVotesProps {
  votes: Array<Vote>;
  account: Account;
  t: TFunction;
}

function OperationDetailsVotes({
  votes,
  account,
  t,
}: OperationsDetailsVotesProps) {
  const sp = useTronSuperRepresentatives();
  const formattedVotes = formatVotes(votes, sp);

  const redirectAddress = useCallback(
    address => {
      const url = getAddressExplorer(
        getDefaultExplorerView(account.currency),
        address,
      );
      if (url) Linking.openURL(url);
    },
    [account],
  );

  return (
    <Section
      title={t("operationDetails.extra.votes", { number: votes.length })}
    >
      {/* {formattedVotes &&
        formattedVotes.map(
          ({ count, validator: { address, name } = {} }, i) => (
            <OpDetailsData key={address}>
              <OpDetailsVoteData>
                <Box>
                  <Text>
                    <Trans
                      i18nKey="operationDetails.extra.votesAddress"
                      values={{ votes: count, name }}
                    >
                      <b>{""}</b>
                      {""}
                      <b>{""}</b>
                    </Trans>
                  </Text>
                </Box>
                <Address onClick={() => redirectAddress(address)}>
                  {address}
                </Address>
              </OpDetailsVoteData>
            </OpDetailsData>
          ),
        )} */}
    </Section>
  );
}

interface OperationDetailsExtraProps {
  extra: { [key: string]: any };
  type: string;
  account: Account;
  t: TFunction;
}

function OperationDetailsExtra({
  extra,
  type,
  account,
  t,
}: OperationDetailsExtraProps) {
  switch (type) {
    case "VOTE": {
      const { votes } = extra;
      if (!votes || !votes.length) return null;

      return <OperationDetailsVotes votes={votes} account={account} t={t} />;
    }
    /** @TODO use formatted number value for the amount */
    case "FREEZE":
      return (
        <Section
          title={t("operationDetails.extra.frozenAmount")}
          value={extra.frozenAmount}
        />
      );
    /** @TODO use formatted number value for the amount */
    case "UNFREEZE":
      return (
        <Section
          title={t("operationDetails.extra.unfreezeAmount")}
          value={extra.unfreezeAmount}
        />
      );
    default:
      return null;
  }
}

export default {
  getURLWhatIsThis,
  OperationDetailsExtra: translate()(OperationDetailsExtra),
};
