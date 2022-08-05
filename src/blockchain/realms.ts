import { getRealms, ProgramAccount, Realm } from "@solana/spl-governance";
import { PublicKey } from "@solana/web3.js";
import { getUniqueKeys } from "../utils/helpers";
import { ConnectionContext } from "./connection";
import { devnetRealms } from "./devnet";

export async function getAllRealms(
  context: ConnectionContext
): Promise<ProgramAccount<Realm>[]> {
  const uniqueProgramIDs: string[] = getUniqueKeys(
    devnetRealms,
    (realm) => realm.programId
  );

  const allRealms = (
    await Promise.all(
      uniqueProgramIDs.map((id) =>
        getRealms(context.connection, new PublicKey(id))
      )
    )
  )
    .flatMap((realms) => Object.values(realms))
    .sort((r1, r2) => r1.account.name.localeCompare(r2.account.name));

  return allRealms;
}
