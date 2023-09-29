/*
 * Renders a group of checkboxes that can be used to select
 * multiple values from a set of options.
 *
 * The corresponding component when rendering the selected
 * values is PropertyGroup.
 *
 */

import React from 'react';
import { arrayOf, bool, node, shape, string } from 'prop-types';
import classNames from 'classnames';
import { FieldArray } from 'react-final-form-arrays';
import { FieldCheckbox, ValidationError } from '../../components';

import css from './FieldCheckboxGroup.module.css';

const FieldCheckboxRenderer = props => {
  const {
    className,
    rootClassName,
    label,
    optionLabelClassName,
    twoColumns,
    id,
    fields,
    options,
    meta,
    values,
    shouldModify
  } = props;


  const classes = classNames(rootClassName || css.root, className);
  const listClasses = twoColumns ? classNames(css.list, css.twoColumns) : css.list;

  const shouldBeChecked = (option) => {
    //Should be checked if:
    //1. option is selected
    //2. option is in initial value
    //3. option is mandatory
    // if(initialValues.pub_services.includes(option.key) || values.pub_services.includes(option.key) || option.mandatory === true){
    //   return true
    // }

    if(option.mandatory === true || values.pub_services?.includes(option.key)){
      return true;
    }
     
  }

  return (
    <fieldset className={classes}>
      {label ? <legend>{label}</legend> : null}
      <ul className={listClasses}>
        {options.map((option, index) => {
          const fieldId = `${id}.${option.key}`;
          const textClassName = optionLabelClassName;
          const textClassNameMaybe = textClassName ? { textClassName } : {};
          let modificationProps   = {}
          if(shouldModify){
            const checked = shouldBeChecked(option);
            const disabled = option.mandatory === true;
            modificationProps = {checked,disabled}
          }
          
          return (
            <li key={fieldId} className={css.item}>
              <FieldCheckbox
                id={fieldId}
                name={fields.name}
                label={option.label}
                value={option.key}
                {...modificationProps}
                {...textClassNameMaybe}
              />
            </li>
          );
        })}
      </ul>
      <ValidationError fieldMeta={{ ...meta }} />
    </fieldset>
  );
};

FieldCheckboxRenderer.defaultProps = {
  rootClassName: null,
  className: null,
  label: null,
  twoColumns: false,
};

FieldCheckboxRenderer.propTypes = {
  rootClassName: string,
  className: string,
  id: string.isRequired,
  label: node,
  options: arrayOf(
    shape({
      key: string.isRequired,
      label: node.isRequired,
    })
  ).isRequired,
  twoColumns: bool,
};

const FieldCheckboxGroup = props => <FieldArray component={FieldCheckboxRenderer} {...props} />;

// Name and component are required fields for FieldArray.
// Component-prop we define in this file, name needs to be passed in
FieldCheckboxGroup.propTypes = {
  name: string.isRequired,
};

export default FieldCheckboxGroup;
