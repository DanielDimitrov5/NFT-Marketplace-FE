import SDKContext from '../sdkContext';
import { useContext } from 'react';

export const useSDK = () => {
    const sdk = useContext(SDKContext);
    return sdk;
}