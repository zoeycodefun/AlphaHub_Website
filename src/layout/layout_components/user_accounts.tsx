// 用户账户管理（顶栏账户管理是所有账户）
import React, {useState, useEffect, } from 'react';
import { X, Plus, Link, Settings, Trash2} from 'lucide-react'
/**
 * 用户管理组件：用户账户管理的弹窗，显示用户在此系统，此市场的所有账户，按照账户类型分类
 */
// 类型定义
interface Exchange {
    id: string;
    name: string;
    type: 'CEX' | 'DEX' | 'OTHER';
    isConnected: boolean;
}
interface Account {
    id: string;
    exchangeId: string;
    accountName: string;
    accountAPIKey?: string;
    accountSecretKey?: string;
    accountWalletAddress?: string;
    accountCreatedAt: Date;
    accountLastCreatedAt: Date;

}
type AccountType = 'CEX' | 'DEX' | 'OTHER';
type ModalType = 'connect' | 'add' | 'manage' | null;

// 用户账户管理弹窗


