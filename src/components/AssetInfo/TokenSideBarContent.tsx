import React from "react";
import TokenSideBarHolder from "./TokenSideBarHolder";
import TokenSideBarBeneficiary from "./TokenSideBarBeneficiary";

interface TokenSideBarContentProps {
  adminAddress: string;
  beneficiaryAddress: string;
  holderAddress: string;
  approvedBeneficiaryAddress: string;
  registryAddress?: string;
}

const TokenSideBarContent = ({
  adminAddress,
  beneficiaryAddress,
  holderAddress,
  approvedBeneficiaryAddress,
  registryAddress
}: TokenSideBarContentProps) => {
  const isEqualBeneficiaryAndHolder = adminAddress === holderAddress && adminAddress === beneficiaryAddress;
  const showHolder = adminAddress === holderAddress || isEqualBeneficiaryAndHolder;
  const showBeneficiary = adminAddress === beneficiaryAddress && !isEqualBeneficiaryAndHolder;

  return (
    <>
      {showHolder && (
        <TokenSideBarHolder
          isEqualBeneficiaryAndHolder={isEqualBeneficiaryAndHolder}
          approvedBeneficiaryAddress={approvedBeneficiaryAddress}
          registryAddress={registryAddress}
        />
      )}
      {showBeneficiary && <TokenSideBarBeneficiary />}
    </>
  );
};

export default TokenSideBarContent;
