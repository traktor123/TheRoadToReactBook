import * as React from 'react';
import clsx from 'clsx';
import styles from './App.module.css';
import { ReactComponent as Check } from './assets/check.svg';

import {
    StyledItem,
    StyledColumn,
} from './StyledComponents';

export type ListProps = {
    list: Story[];
    onRemoveItem: (item: Story) => void;
};

import { Story } from './Data';

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

export const List: React.FC<ListProps> = React.memo(({ list, onRemoveItem }) => {
    console.log('B:List');
    return <ul>
        {
            list.map((item) => (
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
