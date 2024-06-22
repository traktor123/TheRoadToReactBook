import * as React from 'react';
import clsx from 'clsx';
import styles from './App.module.css';
import { ReactComponent as Check } from './assets/check.svg';

import {
    StyledItem,
    StyledColumn,
} from './StyledComponents';

import { Story } from './Data';

import { sortBy } from 'lodash';

export type ListProps = {
    list: Story[];
    onRemoveItem: (item: Story) => void;
};

export type ItemProps = {
    /*
    title: string,
    url: string,
    author: string,
    num_comments: number,
    points: number,
    objectID: number,
    */
    item: Story;
    onRemoveItem: (item: Story) => void;
}

type SortFunction = (list: Story[]) => Story[];

const SORTS: Record<string, SortFunction> = {
    NONE: (list: Story[]) => list,
    TITLE: (list: Story[]) => sortBy(list, 'title'),
    AUTHOR: (list: Story[]) => sortBy(list, 'author'),
    COMMENT: (list: Story[]) => sortBy(list, 'num_comments').reverse(),
    POINT: (list: Story[]) => sortBy(list, 'points').reverse(),
};

export const List: React.FC<ListProps> = React.memo(({ list, onRemoveItem }) => {
    console.log('B:List');

    const [sort, setSort] = React.useState('NONE');

    const handleSort = (sortKey: string) => {
        setSort(sortKey);
    };

    const sortFunction = SORTS[sort];
    const sortedList = sortFunction(list);

    return <ul>
        <li style={{ display: 'flex' }}>
            <span style={{ width: '40%' }}>
                <button type="button" onClick={() => handleSort('TITLE')} style={{backgroundColor: sort == "TITLE" ? 'green' : 'inherit'}}>
                    Title
                </button>
            </span>
            <span style={{ width: '30%' }}>
                <button type="button" onClick={() => handleSort('AUTHOR')} style={{backgroundColor: sort == "AUTHOR" ? 'green' : 'inherit'}}>
                    Author
                </button>
            </span>
            <span style={{ width: '10%' }}>
                <button type="button" onClick={() => handleSort('COMMENT')} style={{backgroundColor: sort == "COMMENT" ? 'green' : 'inherit'}}>
                    Comments
                </button>
            </span>
            <span style={{ width: '10%' }}>
                <button type="button" onClick={() => handleSort('POINT')} style={{backgroundColor: sort == "POINT" ? 'green' : 'inherit'}}>
                    Points
                </button>
            </span>
            <span style={{ width: '10%' }}>Actions</span>
        </li>
        {
            sortedList.map((item) => (
                <div key={item.objectID}>
                    <Item item={item} onRemoveItem={onRemoveItem} />
                </div>
            ))
        }
    </ul>
});

export const isSmall: boolean = true;

export const Item: React.FC<ItemProps> = ({ item, onRemoveItem }) =>
//const Item = ({ item, onRemoveItem }: ItemProps): JSX.Element => 
(
    <StyledItem>
        <StyledColumn width="40%">
            <a href={item.url}>{item.title}</a>
        </StyledColumn>
        &nbsp;
        <StyledColumn width="30%">{item.author}</StyledColumn>
        &nbsp;
        <StyledColumn width="10%">{item.num_comments}</StyledColumn>
        &nbsp;
        <StyledColumn width="10%">{item.points}</StyledColumn>
        &nbsp;
        <StyledColumn width="10%">
            <button className={clsx(styles.button, { [styles.buttonSmall]: isSmall })}
                type="button"
                onClick={() => onRemoveItem(item)}>
                <Check height="18px" width="18px" />
                Dismiss
                {/* onClick={onRemoveItem.bind(null, item)}> */}
            </button>
        </StyledColumn>
    </StyledItem>
)
