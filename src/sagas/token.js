import { put, select, takeEvery, all, call } from "redux-saga/effects";
import { types } from "../reducers/token";
import { getCertificate } from "../reducers/certificate";
import { getLogger } from "../utils/logger";
import {
  transferTokenOwnershipSuccess,
  transferTokenOwnershipFailure,
  getTokenUserAddressSuccess,
  getTokenUserAddressError,
  initializeTokenSuccess,
  initializeTokenFailure
} from "../reducers/token";

import {
  transferTokenOwnership,
  getBeneficiaryAddress,
  initializeTokenInstance,
  getHolderAddress,
  isEscrowContract,
  getApprovedBeneficiaryAddress
} from "../services/token";
import { getProvider } from "../services/etherjs";

const { trace, error } = getLogger("saga:token");

export function* getTokenUsers() {
  try {
    const document = yield select(getCertificate);
    const isTitleEscrow = yield call(isEscrowContract, document);
    if (!isTitleEscrow) throw new Error("Document owner is not a escrow contract");

    const [beneficiaryAddress, holderAddress, approvedBeneficiaryAddress] = yield all([
      call(getBeneficiaryAddress, document),
      call(getHolderAddress, document),
      call(getApprovedBeneficiaryAddress, document)
    ]);
    trace(
      `Beneficiary Address is: ${beneficiaryAddress} and Holder Address is: ${holderAddress} and Approved Target Address is: ${approvedBeneficiaryAddress}`
    );

    yield put(getTokenUserAddressSuccess({ beneficiaryAddress, holderAddress, approvedBeneficiaryAddress }));
  } catch (e) {
    yield put(getTokenUserAddressError(e.message));
  }
}

export function* initializeToken() {
  try {
    const document = yield select(getCertificate);
    const { provider, signer } = yield getProvider();
    //trace(`Web3 provider: ${JSON.stringify(provider)}`);
    yield initializeTokenInstance(document, provider, signer);
    yield put(initializeTokenSuccess());
  } catch (e) {
    error(e);
    yield put(initializeTokenFailure(e.message));
  }
}

export function* transferOwnership({ payload }) {
  try {
    const document = yield select(getCertificate);
    const { newTokenOwner } = payload;

    const transferStatus = yield transferTokenOwnership(document, newTokenOwner);
    trace(`Transfer Status: ${JSON.stringify(transferStatus)}`);

    yield put(transferTokenOwnershipSuccess(transferStatus));
  } catch (e) {
    yield put(transferTokenOwnershipFailure(e.message));
  }
}

export default [
  takeEvery(types.INITIALIZE_TOKEN, initializeToken),
  takeEvery(types.TRANSFER_TOKEN_OWNERSHIP, transferOwnership),
  takeEvery(types.GET_TOKEN_USER_ADDRESS, getTokenUsers)
];