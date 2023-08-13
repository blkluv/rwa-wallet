<script setup lang="ts">
// import { sendMessage } from "webext-bridge/options";
import imgArweave from "~/assets/arweave.svg";
import imgCess from "~/assets/cess.svg";
import imgDB3 from "~/assets/db3-logo.png";

const account = $(inject("account"));

const { isShow, toggle, params, opts } = $(txStore());
const payBy = $ref("$BSTEntropy");
const payTokenList = ["$BSTSwap", "$BSTEntropy"];
const payTokenAddress = $computed(() => {
  const { address } = getContractInfo(payBy.replace("$", ""));
  return address;
});
const { addLoading, addSuccess, alertError } = $(notificationStore());

const storeBy = $ref("Arseeding");
const storeServiceList = ["NFT.Storage", "Arseeding"];
let isLoading = $ref(false);
let approveGas = $ref("");
const paymentContractName = $computed(() => payBy.replace("$", ""));
const { address: spenderAddress } = getContractInfo("RWAProtocol");
const bstPayAmount = parseEther("100");

const addTokenGas = 310796n;

watchEffect(async () => {
  if (!account) return;
  // estimate approve BST allowance gas
  try {
    approveGas = await estimateContractGas({ account, contractName: paymentContractName, functionName: "approve" }, spenderAddress, bstPayAmount);
  } catch (e) {
    console.log("====> e :", e);
  }

  // estimate addToken gas
  // addTokenGas = await estimateContractGas(
  //   { account, contractName: "RWAProtocol", functionName: "addToken" },
  //   params.tokenType,
  //   parseEther(params.basicPrice.toString()),
  //   params.inviteCommission * 100,
  //   params.maxSupply,
  //   "fake-cid",
  //   payTokenAddress
  // );
  // console.log("====> approveGas, addTokenGas :", approveGas, addTokenGas);
});

let status = $ref("");
const doSubmit = async () => {
  isLoading = true;
  try {
    // call allowance
    status = "approve allowance";

    const rzApprove = await writeContract(
      {
        account,
        contractName: paymentContractName,
        functionName: "approve",
      },
      spenderAddress,
      bstPayAmount
    );
    console.log("====> rzApprove :", rzApprove);

    status = "store tieres and links data to db3.js";
    const collectionName = "twitter";
    const db3Rz = await addDb3Item(account, collectionName, params);
    console.log("====> db3Rz :", db3Rz);

    // upload to decentralized storage
    status = "upload to decentralized storage";
    const properties = pick(params, [
      "category",
      "tags",
      "tokenType",
      "distributor",
      "basicPrice",
      "maxSupply",
      "inviteCommission",
      "tierArr",
      "links",
    ]);
    properties["db3DocId"] = db3Rz.id;
    const external_url = ""; // This is the URL that will appear below the asset's image on OpenSea and will allow users to leave OpenSea and view the item on your site.
    const metadata = {
      ...pick(params, ["name", "description", "image", "subTitle"]),
      properties,
      external_url,
    };
    const cid = await storeJson(metadata);
    // per
    console.log("====> cid :", cid);

    const arseedingRz = await storeJsonToArweave(account, metadata, { tokenType: params.tokenType });
    console.log("====> arseedingRz :", arseedingRz);
    if (arseedingRz.err) {
      throw arseedingRz.err;
    }

    status = `Store NFT metadata onto arseeding successed! ${arseedingRz.link}`;

    const tokenList = await readContract(
      {
        account,
        contractName: "RWAProtocol",
        functionName: "getTokenList",
      },
      0,
      1000
    );
    const tokenId = tokenList[0].length;
    // create token
    status = "create new NFT on RWA Protocol";
    const rzToken = await writeContract(
      {
        account,
        contractName: "RWAProtocol",
        functionName: "addToken",
      },
      params.tokenType,
      parseEther(params.basicPrice.toString()),
      params.inviteCommission * 100,
      params.maxSupply,
      cid,
      payTokenAddress
    );
    console.log("====> rzApprove2, cid, rzToken, tokenId :", rzApprove, cid, rzToken, tokenId);
    if (opts.afterSuccess) {
      await opts.afterSuccess();
    }

    // showNotice()?
    // go to token main page:
    // rwa://book/1
    // rwa://twitter/1
    // rwa://book
    // rwa://twitter
    // rwa://sneaker
    // rwa://1
    // rwa://2
  } catch (err) {
    console.log("====> err :", err);
  }
  nextTick(() => {
    status = "";
    isLoading = false;
    toggle();
  });
};

// const doSubmit2 = async () => {
//   isLoading = true;

//   status = "approve allowance";
//   await new Promise((r) => setTimeout(r, 500));
//   status = "upload to decentralized storage";
//   await new Promise((r) => setTimeout(r, 500));
//   status = "create new NFT on RWAProtocol";
//   await new Promise((r) => setTimeout(r, 500));
//   status = "";
//   if (opts.afterSuccess) {
//     await opts.afterSuccess();
//   }
//   nextTick(() => {
//     addSuccess("Create New NFT Successed!");
//     isLoading = false;
//     toggle();
//   });
// };

const doCancel = async () => {
  toggle();
};
</script>

<template>
  <BsDialogDefault :show="isShow" @close="toggle">
    <div class="bg-white flex flex-col min-w-sm w-full">
      <div class="flex-1 py-6 px-4 overflow-y-auto sm:px-6">
        <div class="flex items-start justify-between">
          <h2 class="font-medium text-lg text-gray-900">RWA Intent Preview: Create TwitterFi NFT</h2>
        </div>

        <div class="mt-8">
          <div class="flow-root">
            <ul role="list" class="divide-y divide-gray-200 -my-6">
              <li class="flex py-6">
                <div class="border rounded-md border-gray-200 flex-shrink-0 h-24 p-5 w-24 overflow-hidden">
                  <div i-streamline-money-currency-bitcoin-crypto-circle-payment-blokchain-finance-bitcoin-currency-money class="h-full object-cover object-center w-full" />
                </div>

                <div class="flex flex-col font-medium flex-1 text-base px-4 text-gray-900 justify-between">
                  <h3>Create New RWA Fee</h3>
                  <p class="mt-1 text-sm text-gray-500">Grant 100 $BST allowance</p>
                </div>
                <div flex flex-col justify-between items-end>
                  <BsFormSelect id="payBy" v-model="payBy" :list="payTokenList" />
                  <div class="flex flex-col text-gray-500 items-end">
                    <div>0 $BST</div>
                    <div>{{ approveGas }} Wei</div>
                  </div>
                </div>
              </li>
              <li class="flex py-6">
                <div class="border rounded-md flex border-gray-200 flex-shrink-0 h-24 p-5 w-24 overflow-hidden items-center">
                  <img :src="imgDB3" class="h-auto object-cover object-center w-24" />
                </div>

                <div class="flex flex-col font-medium flex-1 text-base px-4 text-gray-900 justify-between">
                  <h3>Store tieres and links data to DB3.js</h3>
                  <p class="mt-1 text-sm text-gray-500">We can update the tiers and links information via DB3.js without gas</p>
                </div>
                <div flex flex-col justify-between items-end min-w-40>
                  <div />
                  <div class="flex flex-col text-gray-500 items-end">
                    <div>0 $BST</div>
                    <div>0 Wei</div>
                  </div>
                </div>
              </li>
              <li class="flex py-6">
                <div class="border rounded-md border-gray-200 flex-shrink-0 h-24 p-5 w-24 overflow-hidden">
                  <div i-simple-icons-ipfs class="h-full object-cover object-center w-full" v-if="storeBy === 'NFT.Storage'" />
                  <img :src="imgArweave" class="h-full object-cover object-center w-full" v-if="storeBy === 'Arseeding'" />
                  <img :src="imgCess" class="h-full object-cover object-center w-full" v-if="storeBy === 'CESS'" />
                </div>

                <div class="flex flex-col font-medium flex-1 text-base px-4 text-gray-900 justify-between">
                  <h3>Pack and Store metadata</h3>
                  <p class="mt-1 text-sm text-gray-500">Pack metadata and store onto Decentralized storage platform</p>
                </div>
                <div flex flex-col justify-between items-end min-w-40>
                  <BsFormSelect id="storeBy" v-model="storeBy" :list="storeServiceList" />
                  <div class="flex flex-col text-gray-500 items-end">
                    <div>0 $BST</div>
                    <div>0 Wei</div>
                  </div>
                </div>
              </li>
              <li class="flex py-6">
                <div class="border rounded-md border-gray-200 flex-shrink-0 h-24 p-0 w-24 overflow-hidden">
                  <BsBoxImg :src="params.image" :has-modal="true" class="h-full object-cover object-center w-full" />
                </div>

                <div class="flex flex-col font-medium flex-1 text-base px-4 text-gray-900 justify-between">
                  <h3>
                    {{ params.name }}
                  </h3>
                  <p class="mt-1 text-sm text-gray-500">Use the metadata to build your RWA NFT!</p>
                </div>
                <div flex flex-col justify-between items-end>
                  <div />
                  <div class="flex flex-col text-gray-500 items-end">
                    <div>100 $BST</div>
                    <div>{{ addTokenGas }} Wei</div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="border-t border-gray-200 py-6 px-4 sm:px-6">
        <div class="flex font-medium text-base text-gray-900 justify-between">
          <p>Total</p>
          <div flex flex-col items-end>
            <div>100<span inline-block w-12 text-right>$BST</span></div>
            <div>
              {{ approveGas + addTokenGas }}
              <span text-gray-4 text-sm>(estimated)</span>
              <span inline-block w-8 text-right>Wei</span>
            </div>
          </div>
        </div>
        <div my-6 py-6 flex text-base justify-center items-center v-if="status">
          <div i-eos-icons-loading class="h-6 text-black mr-2 w-6" />

          {{ status }}
        </div>
        <div v-else class="mt-6 text-center text-sm text-gray-500 justify-center">
          <BsBtnIndigo :is-loading="isLoading" @click="doSubmit" w-full> Action Confirm </BsBtnIndigo>
          <p mt-6>
            or
            <button type="button" class="font-medium text-indigo-600 hover:text-indigo-500" @click="doCancel">
              Reject
              <span aria-hidden="true"> &rarr;</span>
            </button>
          </p>
        </div>
      </div>
    </div>
  </BsDialogDefault>
</template>

<route lang="yaml">
meta:
  layout: blank
</route>
