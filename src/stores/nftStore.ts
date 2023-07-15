export const nftStore = defineStore('nftStore', () => {
  let nft = $ref({tokenURI: '', token: {}})

  const getNftInfo = async (tokenId) => {
    const rz = await readContract({
        contractName: 'BuidlerProtocol',
        functionName: 'getToken'
    }, tokenId, '', '')
    const tokenURI = rz[0]
    const tokenOwner  = rz[1]
    const basicPrice  = rz[2]
    const totalSupply  = rz[3]
    const maxSupply  = rz[4]
    const items  = rz[5]
    const metas = rz[6]
    const token = await parseURIData(tokenURI)

    nft = {
      tokenURI,
      tokenOwner,
      basicPrice,
      totalSupply,
      maxSupply,
      items,
      metas,
      token,
    }
    console.log('====> tokenId, nft :', tokenId, nft)
  }
  watchEffect(async() => {
    // do some init stuff
  })

  return $$({
    nft,
    getNftInfo,
  })
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(nftStore, import.meta.hot))
