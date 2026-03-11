// accounts management
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { X, Plus, Link, Settings, Trash2, Loader, User, Mail, Phone, AlertTriangle} from 'lucide-react'

// TODO: encrypt user info before sending to backend, perform form validation, provide real-time error feedback, integrate APIs, adjust according to backend



interface PlatformUser {
    id:  string;
    username: string;
    email?: string;
    phone?: string;
    nickname?: string;
    avatar?: string;
    role: string;
    enabled: boolean;
    emailVerified: boolean;
    phoneVerified: boolean;
    lastLoginAt?: string;
}

interface Exchange {
    id: string;
    name: string; 
    type: 'CEX' | 'DEX' | 'OTHER';
    isConnected: boolean;
}

interface ExchangeAccount {
    id: string; 
    exchangeId: string;
    name: string;
    apiKey? : string;
    apiSecretKey?: string;
    walletAddress?: string;
    createdAt: Date;
    lastConnectedAt?: Date; 
    isConnecting?: boolean;
}
type AccountType = 'CEX' | 'DEX' | 'OTHER';
type operateWindowType = 'connect' | 'add' | 'manage' | null;


const EXCHANGE_TYPES = {
    CEX: 'Centralized Exchange',
    DEX: 'Decentralized Exchange',
    OTHER: 'Other Account',
} as const;

const EXCHANGES: Exchange[] = [
    // CEX
    { id: 'binance', name: 'Binance', type: 'CEX', isConnected: false},
    { id: 'okx', name: 'OKX', type: 'CEX', isConnected: false},
    // DEX
    { id: 'hyperliquid', name: 'Hyperliquid', type: 'DEX', isConnected: false},

    // OTHER

];
// platform user information component
const PlatformUserInfo: React.FC<{
    user: PlatformUser;
    onEdit: () => void;
}> = ({ user, onEdit }) => {
    return (
        <div className='bg-white border border-gray-100 rounded-lg p-4 mb-6'>
            <div className='flex items-center justify-between mb-4'>
                <p className='text-lg text-gray-900'>Platform Account Information</p>
                <button 
                onClick={onEdit}
                className='text-blue-600 hover:text-blue-800 text-sm'
                >
                    Edit
                </button>
            </div>
            <div className='flex items-center space-x-4 '>
                <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
                    {user.avatar ? (
                        <img src={user.avatar} alt='photo' className='w-12 h-12 rounded-full '/>
                    ) : (
                        <User className='w-6 h-6 text-blue-600'/>
                    )}
                </div>
                <div className='flex-1'>
                    <div className='flex items-center space-x-2'>
                        <span className='text-gray-900'>{user.nickname || user.username}</span>
                        <span className={`px-2 py-1 text-xs rounded-full 
                            ${user.enabled ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-800'}
                            `}>
                                {user.enabled ? 'Active' : 'Disabled'}
                            </span>
                            <span className='px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full'>
                                {user.role}
                            </span>
                    </div>
                    <div className='flex items-center space-x-4 mt-1 text-sm text-gray-600'>
                        <div className='flex items-center space-x-1'>
                            <User className='w-4 h-4 '/>
                            <span>{user.username}</span>
                        </div>
                        {user.email && (
                            <div className='flex items-center space-x-1'>
                                <Mail className='w-4 h-4' />
                                <span>{user.email}</span>
                                {user.emailVerified && (
                                    <span className='text-green-600'>✔️</span>
                                )}
                            </div>
                        )}
                        {user.phone && (
                            <div className='flex items-center space-x-1'>
                                <Phone className='w-4 h-4 '/>
                                <span>{user.phone}</span>
                                {user.phoneVerified && (
                                    <span className='text-green-600'>✔️</span>
                                )}
                            </div>
                        )}
                    </div>

                    {user.lastLoginAt && (
                        <div className='text-xs text-gray-500 mt-1'>
                            last login: {new Date(user.lastLoginAt).toLocaleString()}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
// platform login or registration information form component
const PlatformAccountLoginRegisterRequired: React.FC<{
    onBindPlatformAccount: () => void;
}> = ({ onBindPlatformAccount }) => {
    return (
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
            <div className='flex items-start space-x-3'>
                <AlertTriangle className='w-5 h-5 text-blue-700 mt-0.5'/>
                <div className='flex-1'>
                    <p className='text-sm text-blue-800 mb-1'>
                        Please log in or register a platform account to connect exchange accounts and use more features
                    </p>
                    <p className='text-sm text-blue-700 mb-3'>
                        You need to create or bind a platform account before linking exchange accounts for trading
                    </p>
                    <button
                    onClick={onBindPlatformAccount}
                    className='px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors'
                    >
                        Bind Platform Account
                    </button>
                </div>
            </div>
        </div>
    );
};


// user accounts management component: support CEX, DEX and OTHER accounts
// function: connect account(with loading and error handling), add account, manage account(view accounts list and delete account)
const UserAccounts: React.FC<{ 
    openAccountWindow: boolean; 
    closeAccountWindow: () => void;
    currentUser?: PlatformUser;
}> = ({
    openAccountWindow,
    closeAccountWindow,
    currentUser
}) => {
    const [activeExchangeType, setActiveExchangeType] = useState<AccountType>('CEX');
    const [selectedExchange, setSelectedExchange] = useState<Exchange | null>(null);
    const [activeOperateWindow, setActiveOperateWindow] = useState<operateWindowType>(null);
    const [allAccounts, setAllAccounts] = useState<ExchangeAccount[]>([]);

    
    // TODO: on mount load user data from backend (database storage)
    useEffect(() => {
        const savedAccounts = localStorage.getItem('exchangeAccounts');
        if (savedAccounts) {
            try {
                const accounts_parsed = JSON.parse(savedAccounts);
                setAllAccounts(
                    accounts_parsed.map((account: any) => ({
                    ...account,
                    createdAt: new Date(account.createdAt),
                    lastConnectedAt: account.lastConnected ? new Date(account.lastConnected) : undefined,
                    isConnecting: false,
                }))
            );
            } catch (error) {
                console.error('Failed to load accounts:', error);
            }
        }
    }, []);


    // accounts data saving function
    const saveAccounts = useCallback((newAccounts: ExchangeAccount[]) => {
        setAllAccounts(newAccounts);
        localStorage.setItem('exchangeAccounts', JSON.stringify(newAccounts));
    }, []);
    
    
    // filter exchanges by labels
    const filteredExchanges = useMemo(
        () => EXCHANGES.filter((exchange) => exchange.type === activeExchangeType),
        [activeExchangeType]
    );


    // get accounts of specific exchange function
    const getExchangeAccounts = useCallback(
        (exchangeId: string) => allAccounts.filter((account) => account.exchangeId === exchangeId),
        [allAccounts]
    );

    
    // connect accounts handler with loading state and error handling
    const handleConnectAccount = useCallback(
        async (acc: ExchangeAccount) => {
            setAllAccounts((prevAccount) => (
                prevAccount.map((account) => 
                account.id === acc.id ? {
                    ...account, isConnecting: true
                } : account
                )
            ));
            try {
                // TODO: real API connection
                await new Promise((reslove, reject) => {
                    setTimeout(() => Math.random() > 0.2 ? reslove(true) :
                reject(new Error('Connection failded: Please check API credentials or network.')), 2000);
            });
            const updatedAccounts = allAccounts.map((account) => (
                account.id === account.id
                ? { ...account, lastConnectedAt: new Date(), isConnecting: false }
                : account));
                saveAccounts(updatedAccounts);
                setActiveOperateWindow(null);
            } catch (error) {
                console.error('Failed to connect account:', error);
                setAllAccounts((prevAccounts) => 
                    prevAccounts.map((account) => 
                    account.id === account.id ? { ...account, isConnecting: false} : account
                    )
                );
                // ❌❌ error notification
            }
        }, [allAccounts, saveAccounts]
        );


    // add account handler
    const handleAddAccount = useCallback(
        (exchangeId: string, accountData: Partial<ExchangeAccount>) => {
            const newAccount: ExchangeAccount = {
                id: `${exchangeId}_${Date.now()}`,
                exchangeId,
                name: accountData.name || `${EXCHANGES.find((exchange) => exchange.id === exchangeId)?.name} Account`,
                ...accountData,
                createdAt: new Date(),
            };
            saveAccounts([...allAccounts, newAccount]);
            setActiveOperateWindow(null);
        },
        [allAccounts, saveAccounts]
    );

    // delete account handler
    const handleDeleteAccount = useCallback(
        (accountId: string) => {
            const updatedAccounts = allAccounts.filter((account) => account.id !== accountId);
            saveAccounts(updatedAccounts)
        }, [allAccounts, saveAccounts]
    );

    // bind platform account handler
    const handleBindPlatformAccount = useCallback(() => {
        // TODO: actual platform account bind action (might open login/register modal or redirect to settings)
        console.log('Bind platform account');
    }, []);

    if (!openAccountWindow) return null;


    return (
        <div>
            <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
                {/** main window */}
                <div className='bg-white rounded-xl w-full h-full md:h-auto md:max-w-4xl md:max-h-[80vh] md:h-[80vh] overflow-hidden flex flex-col 
                md:grid md:grid-rows-[auto-1fr] md:grid-cols-[1fr-3fr]
                '>
                    <div className='flex justify-between items-center p-4 border-b 
                    md:col-span-2
                    '>
                        <span className='text-lg md:text-xl '>Account Management</span>
                        <button
                        onClick={closeAccountWindow}
                        className='p-2 hover:bg-gray-200 rounded-full transition-colors '
                        aria-label="Close account management dialog"
                        >
                            <X className="w-6 h-6 md:w-7 md:h-7" />
                        </button>
                    </div>
                    {/** window content: platform users infomation + exchanges accounts management */}
                    <div className='flex-1 p-4 overflow-y-auto'>
                        {/** if no platform users, show bind account, sign or register first */}
                        {!currentUser ? (
                            <PlatformAccountLoginRegisterRequired
                            onBindPlatformAccount={handleBindPlatformAccount}
                            />
                        ) : (
                            <>
                            {/** show platform user information */}
                            <PlatformUserInfo
                            user={currentUser}
                            onEdit={() => console.log('edit user info')}
                            />
                            {/** exchanges accounts management area */}
                            <div className='md:grid md:grid-cols-[1fr-3fr] md:gap-4'>
                                {/** left: exchanges classfication list */}
                                <div className='mb-4 md:mb-0'>
                                    <nav className='flex flex-col space-y-2'>
                                        {Object.entries(EXCHANGE_TYPES).map(([key, label]) => (
                                            <button
                                            key={key}
                                            onClick={() => setActiveExchangeType(key as AccountType)}
                                            className={`w-full md:w-auto p-3 text-left rounded-lg transition-colors
                                                ${activeExchangeType === key ?
                                                    'bg-blue-50' : 'hover:bg-gray-50 text-gray-800'
                                                }
                                                `}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </nav>
                                </div>
                                {/** right: exchanges list and related operation */}
                                <div className='space-y-4'>
                                    <p className='text-lg mb-4 '>{EXCHANGE_TYPES[activeExchangeType]} List</p>
                                    <div className='space-y-4'>
                                        {filteredExchanges.map((exchange) => {
                                            const exchangeAccounts = getExchangeAccounts(exchange.id);
                                            return (
                                                <div 
                                                key={exchange.id}
                                                className='border rounded-lg p-4'
                                                >
                                                    {/** exchange header */}
                                                    <div className='flex flex-col justify-between items-start mb-4'>
                                                        {/** left: exchange information  */}
                                                        <div>
                                                            <div className='mb-2 flex flex-col'>
                                                                <span className='text-sm md:text-lg'>{exchange.name}</span>
                                                                <span>{exchangeAccounts.length} accounts</span>
                                                            </div>
                                                        </div>
                                                        {/** right: operation buttons and attached popup hook */}
                                                        <div className='flex flex-wrap gap-3'>
                                                            {/** connect accounts */}
                                                            <button
                                                            onClick={() => {
                                                                setSelectedExchange(exchange)
                                                                setActiveOperateWindow('connect')
                                                            }}
                                                            className='flex items-center gap-2 px-3 py-2 md:px-4 md:py-2'
                                                            >
                                                                <Link className='w-4 h-4'/>
                                                                Connect Account
                                                            </button>
                                                            {/** add accounts */}
                                                            <button
                                                            onClick={() => {
                                                                setSelectedExchange(exchange)
                                                                setActiveOperateWindow('add');
                                                            }}
                                                            className='flex items-center gap-2 px-3'
                                                            >
                                                                <Plus className='w-4 h-4'/>
                                                                Add Account
                                                            </button>
                                                            {/** manage accounts */}
                                                            <button
                                                            onClick={() => {
                                                                setSelectedExchange(exchange)
                                                                setActiveOperateWindow('manage');
                                                            }}
                                                            className='flex items-center gap-2 px-3 py-2 md:py-2 bg-gray-50 rounded-full hover:bg-gray-50 transition-colors'
                                                            >
                                                                <Settings className='w-4 h-4'/>
                                                                Manage Accounts
                                                            </button>
                                                        </div>
                                                    </div>
                                                    {/** connected accounts preview */}
                                                    {exchangeAccounts.length > 0 && (
                                                        <div
                                                        className='text-sm text-gray-600'
                                                        >
                                                            Connected accounts: {exchangeAccounts.map(account => account.name).join(', ')}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/** accounts sub windows: render active sub window based on state */}
            {activeOperateWindow === 'connect' && selectedExchange && (
                <ConnectAccountSubWindow
                exchange={selectedExchange}
                accounts={getExchangeAccounts(selectedExchange.id)}
                onConnect={handleConnectAccount}
                onClose={() => setActiveOperateWindow(null)}
                />
            )}
            {activeOperateWindow === 'add' && selectedExchange && (
                <AddAccountSubWindow
                exchange={selectedExchange}
                onAdd={(accountData) => handleAddAccount(selectedExchange.id, accountData)}
                onClose={() => setActiveOperateWindow(null)}
                />
            )}
            {activeOperateWindow === 'manage' && selectedExchange && (
                <ManageAccountSubWindow
                exchange={selectedExchange}
                accounts={getExchangeAccounts(selectedExchange.id)}
                onDelete={handleDeleteAccount}
                onClose={() => setActiveOperateWindow(null)}
                />
            )}
        </div>
    );
};
// connect account sub window component: user selects account to connect and execute action (connect existing account with loading and error handling)
const ConnectAccountSubWindow: React.FC<{
    exchange: Exchange;
    accounts: ExchangeAccount[];
    onConnect: (account: ExchangeAccount) => void;
    onClose: () => void;
}> = ({
    exchange,
    accounts,
    onConnect,
    onClose
}) => {
    const [selectedAccountId, setSelectedAccountId] = useState<string>('');
    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
            {/** connect account sub window */}
            <div className='bg-white rounded-lg max-w-md w-full p-4 md:p-6 flex flex-col'>
                <span className='text-lg mb-4'>Connect {exchange.name} Account</span>
                {accounts.length === 0 ? (
                    <span className='text-gray-600'>No accounts available to connect, please add one first</span>
                ):(
                    // if have accounts, show select and connect button
                    <div className='mb-4'>
                        <label className='block text-sm mb-2'>Select account to connect</label>
                        <select
                        value={selectedAccountId}
                        onChange={(event) => setSelectedAccountId(event.target.value)}
                        className='w-full p-3 border rounded-lg '
                        >
                            <option value="">Please select an account</option>
                            {accounts.map((account) => (
                                <option 
                                key = {account.id}
                                value = {account.id}
                                >{account.name}</option>
                            ))}
                        </select>
                    </div>
                )}
                {/** bottom action buttons */}
                <div 
                className='flex flex-col sm:flex-row justify-end gap-2 mt-2'
                >
                    <button
                    onClick={onClose}
                    className='px-4 py-3 md:px-6 md:py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors'
                    >Cancel</button>
                    <button
                    onClick={()=>{
                        const account = accounts.find(account => account.id === selectedAccountId);
                        if (account) {
                            onConnect(account);
                        }
                    }}
                    disabled={!selectedAccountId}
                    className='px-4 py-3 md:px-6 md:py-2 bg-blue-50 rounded-full hover:bg-blue-100 disabled:opacity-50 transition-colors'
                    >
                        Connect
                    </button>
                </div>
            </div>
        </div>        
    );
};

// add accounts sub window component: user inputs account information to create new account (form with validation, error handling, and submit action)
const AddAccountSubWindow: React.FC<{
    exchange: Exchange;
    onAdd: (accountData: Partial<ExchangeAccount>) => void;
    onClose: () => void;
}> = ({
    exchange,
    onAdd,
    onClose
}) => {
    // TODO: form setup (encrypted storage and high-security settings)
    const [accountFormData, setAccountFormData] = useState({
        name: '',
        apiKey: '',
        apiSecretKey: '',
        walletAddress: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!accountFormData.name.trim()) newErrors.name = 'Account name is required';
        if (exchange.type === 'CEX') {
            if (!accountFormData.apiKey?.trim()) newErrors.apiKey = 'API Key is required';
            if (!accountFormData.apiSecretKey?.trim()) newErrors.apiSecretKey = 'Secret Key is required';
        } else if (!accountFormData.walletAddress?.trim()) {
            newErrors.walletAddress = 'Wallet address is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmitAccountInfo = (event: React.FormEvent) => {
        event.preventDefault();
        if (validateForm()) {
            onAdd(accountFormData);
            setAccountFormData({name: '', apiKey: '', apiSecretKey: '', walletAddress: ''});
        }
    };
    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-lg max-w-md w-full p-4 md:p-6'>
                <h3 className='text-lg mb-4'>Add {exchange.name} Account</h3>
                <form
                onSubmit={handleSubmitAccountInfo}
                className='space-y-4'
                action="">
                    <label
                    className='block text-sm mb-1'
                    >
                        Account Name
                    </label>
                    <input 
                    type="text"
                    value={accountFormData.name}
                    onChange={(event) => setAccountFormData({ ...accountFormData, name: event.target.value })}
                    className='w-full p-3 border rounded-full focus:outline-none'
                    placeholder='Enter account name'
                    required
                    />
                    {errors.name && <p className='text-red-500 text-sm mt-1'>{errors.name}</p>}
        
                        {exchange.type === 'CEX' && (
                            <>
                            <div>
                                <label
                                className='block text-sm mb-1'
                                >API Key</label>
                                <input 
                                type="text"
                                value={accountFormData.apiKey}
                                onChange={(event) => setAccountFormData({...accountFormData, apiKey: event.target.value})}
                                className='w-full p-3 border rounded-full focus:outline-none'
                                placeholder='Enter API Key'
                                required
                                />
                                {errors.apiKey && <p className='text-red-500 text-sm mt-1'>{errors.apiKey}</p>}
                            </div>
                            <div>
                                <label
                                className='block text-sm mb-1'
                                >Secret Key</label>
                                <input 
                                type="password"
                                value={ accountFormData.apiSecretKey}
                                onChange={(event) => setAccountFormData({...accountFormData, apiSecretKey: event.target.value})}
                                className='w-full p-3 border rounded-full focus:outline-none'
                                placeholder='Enter Secret Key'
                                required
                                />
                                {errors.apiSecretKey && <p className='text-red-500 text-sm mt-1'>{errors.apiSecretKey}</p>}
                            </div>
                            </>
                        )}
                        {/** render wallet address input for DEX or OTHER types */}
                        {exchange.type === 'DEX' || exchange.type === 'OTHER' ? (
                            <div>
                                <label 
                                className='block text-sm mb-1'
                                >Wallet Address</label>
                                <input 
                                type="text"
                                value={accountFormData.walletAddress}
                                onChange={(event) => setAccountFormData({...accountFormData, walletAddress: event.target.value})}
                                className='w-full p-3 border rounded-full focus:outline-none'
                                placeholder='Enter wallet address'
                                required
                                />
                                {errors.walletAddress && <p className='text-red-500 text-sm mt-1'>{errors.walletAddress}</p>}
                            </div>
                        ): null}
                        <div
                        className='flex flex-col sm:flex-row justify-end gap-2'
                        >
                            <button
                            type= "button"
                            onClick= {onClose}
                            className='px-4 py-3 md:px-6 md:py-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors'
                            >
                                Cancel
                            </button>
                            <button
                            type="submit"
                            className='px-4 py-3 md:py-2 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors'
                            >Add Account</button>
                        </div>
                </form>
            </div>
        </div>
    );
};
// manage account sub window component: show accounts list with delete action
const ManageAccountSubWindow: React.FC<{
    exchange: Exchange;
    accounts: ExchangeAccount[];
    onDelete: (accountId: string) => void;
    onClose: () => void;
}> = ({
    exchange,
    accounts,
    onDelete,
    onClose
}) => {
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    return (
        <div
        className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'
        >
            <div 
            className='bg-white rounded-lg max-w-lg w-full p-4 md:p-6'
            >
                <h3 className='text-lg mb-4'>
                    Manage {exchange.name} Accounts
                </h3>
                {accounts.length === 0 ? (
                    <span>No accounts to manage, please add one first</span>

                ):(
                    // show accounts list for management
                    <div className='space-y-4'>
                        {accounts.map((account) => (
                            <div 
                            key={account.id}
                            className='flex justify-between items-center p-4 border rounded-lg'
                            >
                                <div className='flex-1'>
                                    <p className=''>{account.name}</p>
                                    <p className=''>Created: {account.createdAt.toLocaleDateString()}</p>
                                    {account.lastConnectedAt && (
                                    <p className=''>Last connected: {account.lastConnectedAt.toLocaleDateString()}</p>
                                )}
                                {account.isConnecting && (
                                    <div className='flex items-center gap-2 text-blue-100'>
                                        <Loader className='w-4 h-4 animate-spin'/>
                                        Connecting...
                                    </div>
                                )}
                                </div>
                                <button
                                onClick={() => setDeleteConfirm(account.id)}
                                className='p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors'
                                aria-label="Delete account"
                                >
                                    <Trash2 className='w-4 h-4'/>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <div className='flex justify-end mt-4'>
                    <button
                    onClick={onClose}
                    className='px-4 py-3 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors'
                    >
                        Close
                    </button>
                </div>
            </div>
            {/** delete confirm window */}
            {deleteConfirm && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
                    <div className='bg-white rounded-lg max-w-sm w-full p-4 md:p-6'>
                        <h4 className='text-lg mb-4'>Confirm Deletion</h4>
                        <p className='text-gray-600 mb-4'>Are you sure you want to delete this account? This action cannot be undone.</p>
                        <div className='flex flex-col sm:flex-row justify-end gap-2'>
                            <button
                            onClick={() => setDeleteConfirm(null)}
                            className='px-4 py-3 md:px-6 md:py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors'
                            >Cancel</button>
                            <button
                            onClick={() => {
                                onDelete(deleteConfirm)
                                setDeleteConfirm(null)
                            }}
                            className='px-4 py-3 md:px-6 md:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors'
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserAccounts;
