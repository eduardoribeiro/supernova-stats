export interface GenericObject<T> {
    [key: string]: T;
}

export interface UsageDetails {
    [key: string]: {
        instances: {
            importInfo: {
                imported: string;
                local: string;
                moduleName: string;
                importType: string;
            },
            props: GenericObject<string | number>;
            propsSpread: boolean;
            location: {
                file: string;
                start: {
                    line: number;
                    column: number;
                }
            }

        }[]
    }
}