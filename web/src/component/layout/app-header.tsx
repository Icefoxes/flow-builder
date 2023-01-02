import { FC, useState } from "react";
import { AutoComplete, Avatar, Badge, Input, Layout, SelectProps } from 'antd';
import { useNavigate } from "react-router-dom";
import {
    UserOutlined,
    InfoCircleOutlined,
} from '@ant-design/icons';
import './app-header.scss';
import { debounce } from 'lodash';
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
            const idx = item.nodeName.indexOf(q);
            return {
                value: JSON.stringify(item),
                label: (
                    <div
                        key={item.nodeId}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <span>
                            [{item.nodeType}] Found {' '}
                            {item.nodeName.substring(0, idx)}<strong>{q}</strong>{item.nodeName.substring(idx + q.length, item.nodeName.length)}
                        </span>
                        <span>in flow {item.flowName} {items.length} results</span>
                    </div>
                ),
            };
        });

    const handleSearch = (q: string) => {
        if (q && q.length >= 3) {
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
        navigate(`flows/${JSON.parse(value).alias}`)
    };

    return (
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
                onSearch={debounce(handleSearch, 300)}
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
    )
}