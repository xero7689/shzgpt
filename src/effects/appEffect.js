import { useState, useEffect, useRef } from 'react';


export const useAppEffect = ({chatHistoryState}) => {
    const appBarRef = useRef(null);
    const chatInterfaceRef = useRef(null);
    const chatContentRef = useRef(null);

    const [appBarHeight, setAppBarHeight] = useState(0);
    const [innerHeight, setInnerHeight] = useState(window.innerHeight);
    const [chatInterfaceHeight, setChatInterfaceHeight] = useState(0);

    /**
     * Scroll to the bottom of view once history being change
     */
    useEffect(() => {
        console.log("Scroll Effect");
        chatContentRef.current.scrollTo({
            top: chatContentRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }, [chatHistoryState]);

    /**
     * Effect that calculate the size of AppBar and Content
     */
    useEffect(() => {
        if (chatInterfaceRef.current && appBarRef.current) {
            setAppBarHeight(appBarRef.current.offsetHeight);
            const chatInterfaceHeight = window.innerHeight - appBarRef.current.offsetHeight;
            setChatInterfaceHeight(chatInterfaceHeight);
        }
    }, [innerHeight]);

    /**
     * Effect that change the App height dynamically if resizing
     */
    useEffect(() => {
        const handleResize = () => setInnerHeight(window.innerHeight);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    });

    return {appBarHeight, innerHeight, chatInterfaceHeight, appBarRef, chatInterfaceRef, chatContentRef};
}