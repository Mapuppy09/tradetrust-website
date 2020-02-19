import React, { useState, useEffect } from "react";
import { getLogger } from "../../utils/logger";
import css from "./TokenSideBar.scss";
import TokenSideBarHolder from "./TokenSideBarHolder";
import TokenSideBarBeneficiary from "./TokenSideBarBeneficiary";
import TokenSideBarNoMatch from "./TokenSideBarNoMatch";
import { changeHolder, endorseBeneficiaryTransfer, endorseTransfer, surrenderToken } from "../../services/token";
import TokenTransactionSuccess from "./TokenTransactionSuccess";
import { TOKEN_ACTION_TYPES, getSuccessResponse } from "./util";
const { trace, error } = getLogger("component:TokenSideBarContent");
import getUserRoles, { UserRole } from "../../utils/UserRolesUtil";
import { useSelector } from "react-redux";
import { NETWORK_NAME } from "../../config";
interface TokenSideBarContentProps {
  adminAddress: string;
  beneficiaryAddress: string;
  holderAddress: string;
  approvedBeneficiaryAddress: string;
}

const TokenSideBarContent = ({
  adminAddress,
  beneficiaryAddress,
  holderAddress,
  approvedBeneficiaryAddress
}: TokenSideBarContentProps) => {
  const userRole = getUserRoles({ adminAddress, holderAddress, beneficiaryAddress });
  const [fieldValue, setFieldValue] = useState({
    newHolder: "",
    approvedBeneficiary: approvedBeneficiaryAddress || ""
  });
  const tokenSidebarError = { accessDenied: false, networkMismatch: false, metamaskNotFound: false };
  trace(`admin address: ${adminAddress}, holder address: ${holderAddress}, beneficiary address: ${beneficiaryAddress}`);
  const [showActionLoader, toggleActionLoader] = useState(false);
  const [actionError, setActionError] = useState<{ type: TOKEN_ACTION_TYPES; message: string } | null>(null);
  const [transactionSuccessResponse, setTransactionSuccessResponse] = useState<{
    type: TOKEN_ACTION_TYPES;
    hash: string;
    message: string;
  } | null>(null);

  const { networkIdVerbose, metamaskNotFound } = useSelector((state: any) => ({
    networkIdVerbose: state.application.networkIdVerbose,
    metamaskNotFound: state.admin.metamaskNotFound
  }));

  const isEqualBeneficiaryAndHolder = userRole === UserRole.HolderBeneficiary;
  const showHolder = userRole === UserRole.Holder || isEqualBeneficiaryAndHolder;
  const showBeneficiary = userRole === UserRole.Beneficiary && !isEqualBeneficiaryAndHolder;
  tokenSidebarError.accessDenied = userRole === UserRole.NoMatch;
  tokenSidebarError.networkMismatch = NETWORK_NAME.toLowerCase() !== networkIdVerbose.toLowerCase();
  tokenSidebarError.metamaskNotFound = metamaskNotFound;

  trace(`config network: ${NETWORK_NAME} and metamask network: ${networkIdVerbose}`);
  trace(`error in sidebar access ${JSON.stringify(tokenSidebarError)}`);
  useEffect(() => {
    setFieldValue({ ...fieldValue, ...{ approvedBeneficiary: approvedBeneficiaryAddress } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approvedBeneficiaryAddress]);

  const handleInputChange = (e: any) => {
    setFieldValue({ ...fieldValue, ...{ [e.target.name]: e.target.value } });
  };

  const handleFormActions = async (fn: Function, actionType: TOKEN_ACTION_TYPES, value = "") => {
    try {
      setActionError(null);
      setTransactionSuccessResponse(null);
      toggleActionLoader(true);
      const hash = await fn(value);
      trace(`transaction mined hash: ${hash}`);
      setTransactionSuccessResponse({ type: actionType, hash, message: getSuccessResponse(actionType) });
      toggleActionLoader(false);
    } catch (e) {
      error(`handle action error ${JSON.stringify(e)}`);
      toggleActionLoader(false);
      setActionError({ type: actionType, message: e.message || e.reason });
    }
  };

  const approveChangeBeneficiary = () => {
    const { approvedBeneficiary } = fieldValue;
    handleFormActions(endorseTransfer, TOKEN_ACTION_TYPES.ENDORSE_BENEFICIARY, approvedBeneficiary);
  };

  const transferHoldership = async () => {
    const { newHolder } = fieldValue;
    handleFormActions(changeHolder, TOKEN_ACTION_TYPES.CHANGE_HOLDER, newHolder);
  };

  const changeBeneficiary = () => {
    const { approvedBeneficiary } = fieldValue;
    handleFormActions(endorseBeneficiaryTransfer, TOKEN_ACTION_TYPES.CHANGE_BENEFICIARY, approvedBeneficiary);
  };

  const surrenderDocument = () => {
    handleFormActions(surrenderToken, TOKEN_ACTION_TYPES.SURRENDER_DOCUMENT);
  };

  if (transactionSuccessResponse) {
    return (
      <TokenTransactionSuccess hash={transactionSuccessResponse.hash} message={transactionSuccessResponse.message} />
    );
  }

  return (
    <>
      {showActionLoader && (
        <div className={css.overlay}>
          <div className={css.loader} />
        </div>
      )}
      <TokenSideBarNoMatch errorType={tokenSidebarError}>
        <>
          {showHolder && (
            <TokenSideBarHolder
              isEqualBeneficiaryAndHolder={isEqualBeneficiaryAndHolder}
              approvedBeneficiaryAddress={fieldValue.approvedBeneficiary}
              newHolder={fieldValue.newHolder}
              handleInputChange={handleInputChange}
              transferHoldership={transferHoldership}
              changeBeneficiary={changeBeneficiary}
              surrenderDocument={surrenderDocument}
              error={actionError}
            />
          )}
          {showBeneficiary && (
            <TokenSideBarBeneficiary
              setBeneficiary={handleInputChange}
              approveChangeBeneficiary={approveChangeBeneficiary}
              approvedBeneficiary={fieldValue.approvedBeneficiary}
              error={actionError}
            />
          )}
        </>
      </TokenSideBarNoMatch>
    </>
  );
};

export default TokenSideBarContent;