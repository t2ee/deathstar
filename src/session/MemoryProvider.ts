import SessionProvider from './SessionProvider';

class MemoryProvider extends SessionProvider {
    private store: Map<string, any> = new Map<string, any>();

    protected async get(id: string): Promise<any> {
        return this.store.get(id);
    }

    protected async set(id: string, data: any): Promise<void> {
        this.store.set(id, data);
    }

    protected async delete(id: string): Promise<void> {
        this.store.delete(id);
    }
}

export default MemoryProvider;
