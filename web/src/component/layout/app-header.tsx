import { FC, useState } from "react";
import { AutoComplete, Avatar, Badge, Input, Layout, SelectProps } from 'antd';
import { useNavigate } from "react-router-dom";
import {
    UserOutlined,
    InfoCircleOutlined,
} from '@ant-design/icons';
import { useDebounceCallback } from '@react-hook/debounce';
import './app-header.scss';
import { useLazySearchNodeQuery } from "../../service";
import { SearchItem } from "../../model";


const { Header } = Layout;

interface AppHeaderProps {
    setCollapsed: (v: boolean) => void;
    collapsed: boolean;
    onAboutClick: VoidFunction;
}

export const AppHeader: FC<AppHeaderProps> = ({ setCollapsed, collapsed, onAboutClick }) => {
    const navigate = useNavigate();

    const [search, setSearch] = useState<string>('');
    const [searchNode] = useLazySearchNodeQuery();
    const [options, setOptions] = useState<SelectProps<SearchItem>['options']>([]);

    const searchResult = (q: string, items: SearchItem[]) =>
        items.map((item) => {
            return {
                value: item.flowId,
                label: (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <span>
                            [{item.nodeType}] Found {q} on{' '}
                            {item.nodeName}
                        </span>
                        <span>in flow {item.flowName} {items.length} results</span>
                    </div>
                ),
            };
        });

    const handleSearch = (q: string) => {
        if (q && q.length > 4) {
            searchNode({ q }).unwrap()
                .then(nodes => {
                    setOptions(searchResult(q, nodes));
                });
            return;
        }
        setOptions([]);
    };

    const onSelect = (value: string) => {
        setSearch('');
        navigate(`flows/${value}`)
    };

    return <>
        <Header id="gnomon-header" >
            {/* {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: () => setCollapsed(!collapsed),
            })} */}

            <AutoComplete
                className="auto-complete"
                value={search}
                onChange={e => setSearch(e)}
                dropdownMatchSelectWidth={400}
                style={{ width: 600 }}
                options={options}
                autoFocus
                onSelect={onSelect}
                onSearch={useDebounceCallback(handleSearch, 300)}
            >
                <Input.Search size="large" placeholder="search node" enterButton />
            </AutoComplete>

            <div className="icon-container">
                <InfoCircleOutlined className="icon" size={40} onClick={onAboutClick} />
                <span className="avatar-item">
                    <Badge count={1}>
                        <Avatar shape="square" icon={<UserOutlined />} />
                    </Badge>
                </span>
            </div>
        </Header>
    </>
}