import React from 'react';
import PropTypes from 'prop-types';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import './propsTable.css';

const renderType = prop => {
  if (prop.type) {
    // JS prop
    return prop.type.name;
  } else if (prop.tsType) {
    // TS Prop
    if (prop.tsType.raw) {
      // Raw is like 'h1' | 'h2' | 'h3'
      return prop.tsType.raw;
    }
    return prop.tsType.name;
  }

  return '';
};

// This component is only for our React components
const PropsTable = ({ caption, propList }) => (
  <table className="ws-props-table pf-c-table pf-m-compact pf-m-grid-md" role="grid" aria-label="Properties for a component">
    <caption>{caption}</caption>
    <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Type</th>
        <th className="pf-c-table__icon" scope="col">
          Required
        </th>
        <th scope="col">Default</th>
        <th scope="col">Description</th>
      </tr>
    </thead>
    <tbody>
      {propList &&
        propList.map(prop => (
          <tr key={prop.name}>
            <td className="pf-m-fit-content">{prop.name}</td>
            <td>{renderType(prop)}</td>
            <td className="pf-c-table__icon">{prop.required && <ExclamationCircleIcon />}</td>
            <td>{prop.defaultValue && prop.defaultValue.value}</td>
            <td>{`${prop.description}`}</td>
          </tr>
        ))}
    </tbody>
  </table>
);

PropsTable.propTypes = {
  caption: PropTypes.node,
  propList: PropTypes.any
};

PropsTable.defaultProps = {
  caption: null,
  propList: []
};

export default PropsTable;
