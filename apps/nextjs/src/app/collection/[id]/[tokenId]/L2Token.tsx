"use client";

import { api } from "@/utils/api";
import { findTokenName, padAddress } from "@/utils/utils";
import { useAccount } from "@starknet-react/core";

import { Button } from "@realms-world/ui";

import { BuyModal } from "../../marketplace/buy/BuyModal";
import TokenOwnerActions from "../../marketplace/TokenOwnerActions";
import { LoadingSkeleton } from "./loading";
import { TokenInformation } from "./TokenInformation";

//import { SweepModal } from '@reservoir0x/reservoir-kit-ui'

export const L2Token = ({
  contractAddress,
  tokenId,
  children,
}: {
  contractAddress: string;
  children?: React.ReactNode;
  tokenId: string;
}) => {
  const [erc721Token, { isLoading }] = api.erc721Tokens.byId.useSuspenseQuery({
    id: contractAddress + ":" + tokenId,
  });
  const { address } = useAccount();

  if (!erc721Token) {
    return <div>Token Information Loading</div>;
  }

  const activeListings = erc721Token?.listings?.filter(
    (listing) => listing.active === 1,
  );

  const lowestPriceActiveListing = activeListings?.reduce(
    (minPriceListing, currentListing) => {
      return currentListing?.price < minPriceListing?.price
        ? currentListing
        : minPriceListing;
    },
    activeListings[0],
  );

  const collectionId = findTokenName(contractAddress);

  return (
    <>
      {erc721Token ? (
        <>
          <TokenInformation
            token={erc721Token}
            collectionId={collectionId}
            collection={null}
          >
            {erc721Token.owner == padAddress(address) && (
              <TokenOwnerActions
                token={erc721Token}
                tokenId={tokenId}
                contractAddress={contractAddress}
              />
            )}
            {lowestPriceActiveListing && (
              <BuyModal
                trigger={
                  <Button className="mt-8 w-full" size={"lg"}>
                    Buy
                  </Button>
                }
                tokenId={tokenId}
                token={erc721Token}
                collectionId={collectionId}
                orderId={0} //erc721Token?.listings?.[0]?.id}
                //openState={openState}
                /*onClose={(data, stepData, currentStep) => {
        if (mutate && currentStep == BuyStep.Complete) mutate()
      }}
      onPointerDownOutside={(e) => {
        const privyLayer = document.getElementById('privy-dialog')

        const clickedInsidePrivyLayer =
          privyLayer && e.target ? privyLayer.contains(e.target as Node) : false

        if (clickedInsidePrivyLayer) {
          e.preventDefault()
        }
      }}*/
              />
            )}
            {collectionId == "beasts" &&
              erc721Token.metadata?.attributes?.length && (
                <div className="mt-4 rounded border bg-dark-green">
                  <div className="flex items-center justify-between border-b px-3 py-2 pr-6">
                    <h5>Type:</h5>
                    <span className="text-xl">
                      {
                        erc721Token.metadata?.attributes.find(
                          (trait) => trait.trait_type === "type",
                        )?.value
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b px-3 py-2 pr-6">
                    <h5>Tier: </h5>
                    <span className="text-xl">
                      {
                        erc721Token.metadata?.attributes.find(
                          (trait) => trait.trait_type === "tier",
                        )?.value
                      }
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b px-3 py-2 pr-6">
                    <h5>Level: </h5>
                    <span className="text-xl">
                      {
                        erc721Token.metadata?.attributes.find(
                          (trait) => trait.trait_type === "level",
                        )?.value
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b px-3 py-2 pr-6">
                    <h5>Health: </h5>
                    <span className="text-xl">
                      {
                        erc721Token.metadata?.attributes.find(
                          (trait) => trait.trait_type === "health",
                        )?.value
                      }
                    </span>
                  </div>
                </div>
              )}
          </TokenInformation>
        </>
      ) : (
        "No Token Found"
      )}
      {isLoading && <LoadingSkeleton />}
    </>
  );
};
