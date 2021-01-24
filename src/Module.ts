interface Module<T> {
    start: (...args: any[]) => Promise<T>;
    stop?: () => Promise<void>;
}

export default Module;
