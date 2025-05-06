import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {
  getAssociatedTokenAddress
} from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { AksaraToken } from "../target/types/aksara_token";

const TOKEN_METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");

function findMetadataPda(mint: PublicKey): PublicKey {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  )[0];
}

describe("aksara-token", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.AksaraToken as Program<AksaraToken>;
  const wallet = provider.wallet;

  let mintPda: PublicKey;
  let tokenAccount: PublicKey;

  it("Minting Token!", async () => {
  [mintPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("collection_mint")],
    program.programId
  );

  const metadataPda = findMetadataPda(mintPda);
  tokenAccount = await getAssociatedTokenAddress(mintPda, wallet.publicKey);

  try {
    await program.methods
      .initialize("Aksara", "AKS", "https://raw.githubusercontent.com/webstriiix/aksara-token/master/0.json")
      .accounts({
        metadata: metadataPda,
        authority: wallet.publicKey,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
      })
      .rpc();

    console.log("✅ Minting succeeded");
  } catch (err: any) {
    console.error("❌ Minting failed", err);
    if (err.logs) console.error("Logs:\n", err.logs.join("\n"));
    throw err;
  }
});

it("Burning Token!", async () => {
  try {
    await program.methods
      .burnToken(new anchor.BN(100_000_000)) // 100 tokens
      .accounts({
        mint: mintPda,
        tokenAccount,
        authority: wallet.publicKey,
      })
      .rpc();

    console.log("🔥 Burn successful!");
  } catch (err: any) {
    console.error("❌ Burn failed", err);
    if (err.logs) console.error("Logs:\n", err.logs.join("\n"));
    throw err;
  }
});

});
