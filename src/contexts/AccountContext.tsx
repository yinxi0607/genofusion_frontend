import { createContext, useContext } from 'react';

interface AccountContextType {
    account: string;
    setAccount: (account: string) => void;
}

const AccountContext = createContext<AccountContextType>({
    account: '',
    setAccount: () => {},
});

export const useAccountContext = () => useContext(AccountContext);

export default AccountContext;
