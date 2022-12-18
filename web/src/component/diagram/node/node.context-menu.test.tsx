
import { render, screen } from '@testing-library/react';
import { NodeContextMenu } from './node.context-menu';
import { FunctionalTypeEnum, GnomonNode, NodeTypeMeta } from '../../../model';

const NewNode: GnomonNode = {
    id: '1',
    data: {
        nodeType: 'Kafka',
        label: 'New',
    },
    position: {
        x: 0,
        y: 0
    },
    type: 'gnomon'
};

const mockedMetas: NodeTypeMeta[] = [{
    name: 'Kafka',
    icon: 0,
    functionalType: FunctionalTypeEnum.External,
    attributes: []
}];

describe("NodeModalComponent", () => {
    beforeEach(() => {

        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: jest.fn().mockImplementation(query => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: jest.fn(), // Deprecated
                removeListener: jest.fn(), // Deprecated
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                dispatchEvent: jest.fn(),
            })),
        });

        Object.defineProperty(window, "localStorage", {
            value: {
                getItem: jest.fn(() => JSON.stringify(mockedMetas)),
                setItem: jest.fn(() => null),
            },
            writable: true,
        });
    });
    it('renders title', () => {
        render(<NodeContextMenu onItemClick={(item, props) => {

        }}/>);
    });
})