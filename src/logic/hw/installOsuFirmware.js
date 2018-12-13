// @flow
import type Transport from "@ledgerhq/hw-transport";
import type { Observable } from "rxjs";
import { last } from "rxjs/operators";
import type { OsuFirmware } from "../../types/manager";
import ManagerAPI from "../../api/Manager";

export default (
  transport: Transport<*>,
  targetId: string | number,
  firmware: OsuFirmware,
): Observable<*> => {
  const params = {
    targetId,
    ...firmware,
    firmwareKey: firmware.firmware_key,
  };
  return ManagerAPI.install(transport, "firmware", params).pipe(last());
};
