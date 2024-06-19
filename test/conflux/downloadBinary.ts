import path from "node:path";
import pfs from "node:fs/promises";
import fs from "node:fs";
import { Readable } from "node:stream";
import { finished } from "node:stream/promises";

const TAG = "2.3.5";

const releaseURL = `https://github.com/Conflux-Chain/conflux-rust/releases/download/v${TAG}/conflux_linux_glibc2.27_x64_v${TAG}.zip`;

const confluxPath = path.join(__dirname, "./temp/conflux");

export async function checkConfluxBinaryExists() {
  try {
    await pfs.access(confluxPath, fs.constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
}

export async function download() {
  try {
    console.log("start to download conflux binary");
    const res = await fetch(releaseURL);
    if (res.body === null) {
      throw new Error("res.body is null");
    }
    const file = fs.createWriteStream(confluxPath, { flags: "wx" });
    await finished(Readable.fromWeb(res.body as any).pipe(file));
  } catch (error) {
    console.log("download conflux binary error", error);
    if (await checkConfluxBinaryExists()) {
      await pfs.unlink(confluxPath);
    }
  }
}
