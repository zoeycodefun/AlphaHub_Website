import React, { useState, useEffect, useCallback, useMemo,memo, Suspense } from 'react';
import { Routes, Route, useNavigate, useLocation} from 'react-router-dom';
import TradeCenterNavigation from './trade_center_pages/trade_center_pages_components/trade_center_navigation';
import {
    type Exchange,
    type TimeZone,
    type TradeCenterState,
} from './trade_center_pages/type/trade_center_navigation_type'
import {
    PAGE_CONFIGS,
    type PageConfig,
} from './trade_center_pages/type/trade_center_pages_type'

// load page components dynamically
const loadPageComponent = (pageConfig: PageConfig) => {
    const LazyComponent = React.lazy(pageConfig.component);
    return <LazyComponent />;
};
// load component
const PageLoader: React.FC = memo(() => (
    <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
    </div>
));
// error boundary
class ErrorBoundary extends React.Component<
    { children: React.ReactNode; fallback?:React.ComponentType<{ error: Error}> },
    { hasError: boolean; error: Error | null }
> {
    constructor(props: { children: React.ReactNode; fallback?:React.ComponentType<{ error: Error}>}) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }
    
}