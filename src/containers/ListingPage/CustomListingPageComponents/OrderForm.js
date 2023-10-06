import React, { useState } from 'react'
import { Field, Form as FinalForm } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import * as validators from '../../../util/validators'

import { Form, PrimaryButton, FieldTextInput, FieldSelect, H5, H4, FieldDateInput, H6, AspectRatioWrapper, IconClose } from '../../../components';
import { compose } from 'redux';
import { FormattedMessage, injectIntl, intlShape } from '../../../util/reactIntl';
import { bool } from 'prop-types';

import css from './Listing.module.css';
import axios from 'axios';
import { FieldArray } from 'react-final-form-arrays';


const MESSAGE_MAX_LENGTH = 1500;
const ACCEPT_IMAGES = 'image/*';

//
const FieldAddImage = props => {
    const { formApi, onImageUpload, aspectWidth = 1, aspectHeight = 1, ...rest } = props;
    return (
        <Field form={null} {...rest}>
            {fieldprops => {
                const { accept, input, label, values, disabled: fieldDisabled } = fieldprops;
                const { name, type } = input;
                const images = values.images || [];
                const onChange = async e => {
                    const file = e.target.files[0];
                    const res = await onImageUpload(file);
                    if (res) {
                        const { public_id, secure_url } = res?.data || {}
                        formApi.change(`images`, [...images, { id: public_id, url: secure_url }]);
                        formApi.blur(`images`);
                    }
                };
                const inputProps = { accept, id: name, name, onChange, type };
                return (
                    <div className={css.addImageWrapper}>
                        {fieldDisabled ? null : <input {...inputProps} className={css.addImageInput} />}
                        <label htmlFor={name} className={css.addImage}>
                            {label}
                        </label>
                    </div>
                );
            }}
        </Field>
    );
};

const FieldOrderImage = (props) => {
    const { imageUrl, alt, onRemoveImage } = props;

    return (
        <div className={css.orderAddedImage}>
            <button onClick={onRemoveImage} className={css.closeIcon}>
                <IconClose />
            </button>

            <img src={imageUrl} alt={alt} height={100} width={100} />
        </div>
    )
}

const OrderFormComponent = (props) => {
    const [state, setState] = useState({ imageUploadRequested: false });

    const cloudinaryUrl = process.env.REACT_APP_CLOUDINARY_URL;
    const cloudinaryPreset = process.env.REACT_APP_CLOUDINARY_PRESET;

    const onImageUploadHandler = async (file) => {
        if (!file) return;

        setState({ imageUploadRequested: true });

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', cloudinaryPreset);
        
        try {
            const response = await axios.post(
                cloudinaryUrl,
                formData
            );

            return response;
        } catch (error) {
            console.log('Error!!:', error)
        }
        setState({ imageUploadRequested: false });
    }


    const onImageRemoveHandler = async (fieldApi, imageId, imageIndex) => {

        fieldApi.remove(imageIndex); // Image deleted successfully
        //     }
        // try {
        //     const response = await deleteImageCloudinary(imageId);
        //     if (response.status === 200) {
        //         
        // } catch (error) {
        //     console.error('Error deleting image:', error);
        // }

    }

    return (
        <FinalForm
            {...props}
            mutators={{ ...arrayMutators }}
            render={fieldRenderProps => {
                const {
                    rootClassName,
                    className,
                    formId,
                    form,
                    handleSubmit,
                    inProgress,
                    invalid,
                    intl,
                    values,
                    servicesWithAmount,
                    authorDisplayName,

                } = fieldRenderProps;

                console.log(values, '&& values &&')

                //write validations here
                const serviceRequired = validators.required(intl.formatMessage({ id: 'CustomListingPage.Listing.serviceRequiredMessage' }));


                const dateRequired = validators.bookingDateRequired(intl.formatMessage({ id: 'CustomListingPage.Listing.dateRequiredMessage' }));

                const messageequired = validators.required(intl.formatMessage({ id: 'CustomListingPage.Listing.messageRequiredMessage' }));

                const validateMessageLength = validators.maxLength(intl.formatMessage({ id: 'CustomListingPage.Listing.messageInvalidLengthMessage' }, { length: MESSAGE_MAX_LENGTH }), MESSAGE_MAX_LENGTH);

                //define class and conditions here

                const submitInProgress = inProgress;
                const submitDisabled = invalid || submitInProgress;



                const formTitle = intl.formatMessage({ id: 'CustomListingPage.Lisitng.orderFormTitle' }, { advisor: authorDisplayName })
                const orderButtonText = intl.formatMessage({ id: 'CustomListingPage.Listing.orderFormButton' })
                const serviceFieldLabel = intl.formatMessage({ id: 'CustomListingPage.Listing.orderFormSelectServicesLabel' })
                const dateFieldLabel = intl.formatMessage({ id: 'CustomListingPage.Listing.orderFormDateFieldLabel' });
                const dateFieldPlaceholder = intl.formatMessage({ id: 'CustomListingPage.Listing.orderFormDateFieldPlaceholder' })
                const messageFieldLabelText = intl.formatMessage({ id: 'CustomListingPage.Listing.orderFormMessageFieldLabel' })
                const messageFieldHelperText = intl.formatMessage({ id: 'CustomListingPage.Listing.orderFormMessageFieldHelperText' })
                const imageFieldLabelText = intl.formatMessage({ id: 'CustomListingPage.Listing.orderFormImageInputFieldLabel' })
                const imageFieldHelperText = intl.formatMessage({ id: 'CustomListingPage.Listing.orderFormImageFieldHelperText' })


                const messageFieldLabel = <div>
                    <H6>{messageFieldLabelText}</H6>
                    <small>{messageFieldHelperText}</small>
                </div>

                return (
                    <Form onSubmit={handleSubmit}>

                        <H4>{formTitle}</H4>
                        <div className={css.orderFormBoxA}>
                            <FieldSelect id="select-service" name="service" label={serviceFieldLabel} validate={serviceRequired}>
                                <option value="">Choose a service...</option>
                                {servicesWithAmount.map((s, i) => {
                                    const { amount, title } = s;
                                    return <option key={i} value={title}>{title} - ${amount}</option>
                                })}
                            </FieldSelect>

                            <FieldDateInput
                                id="select-date"
                                name="purchasingDate"
                                label={dateFieldLabel}
                                placeholderText={dateFieldPlaceholder}
                                validate={dateRequired} />
                        </div>

                        <FieldTextInput
                            type="textarea"
                            id="message"
                            name="message"
                            label={messageFieldLabel}
                            validate={validators.composeValidators(messageequired, validateMessageLength)}
                        />

                        {/* Image upload section */}

                        <div className={css.addImageSection}>
                            <div className={css.addImageField}>
                                <H6>{imageFieldLabelText}</H6>
                                <small>{imageFieldHelperText}</small>
                                <FieldAddImage
                                    formApi={form}
                                    onImageUpload={onImageUploadHandler}
                                    id="addImage"
                                    name="images"
                                    accept={ACCEPT_IMAGES}
                                    label={
                                        <span className={css.chooseImageText}>
                                            <span className={css.chooseImage}>
                                                <FormattedMessage id="EditListingPhotosForm.chooseImage" />
                                            </span>
                                        </span>
                                    }
                                    type="file"
                                    disabled={state.imageUploadRequested}
                                    values={values}
                                />
                            </div>

                            {/* Field array here */}
                            <FieldArray name="images">
                                {({ fields }) => {
                                    return (fields.map((name, index) => {
                                        const imageId = fields.value[index].id;
                                        const imageUrl = fields.value[index].url;

                                        return (
                                            <FieldOrderImage
                                                key={imageId}
                                                imageUrl={imageUrl}
                                                alt={name}
                                                onRemoveImage={() => onImageRemoveHandler(fields, imageId, index)}
                                                intl={intl}
                                            />
                                        )
                                    }))
                                }
                                }
                            </FieldArray>
                        </div>



                        <PrimaryButton type="submit" inProgress={submitInProgress} disabled={submitDisabled}>
                            {orderButtonText}
                        </PrimaryButton>

                    </Form>
                )


            }}
        />
    )
};


OrderFormComponent.defaultProps = { inProgress: false };

OrderFormComponent.propTypes = {
    inProgress: bool,
    // from injectIntl
    intl: intlShape.isRequired,
};

const OrderForm = compose(injectIntl)(OrderFormComponent);

export default OrderForm;
