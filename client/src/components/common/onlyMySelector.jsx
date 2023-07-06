import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selector as userSelector, action as userAction } from 'store/user'
import CheckboxField from 'components/common/form/checkboxField'
import PropTypes from 'prop-types'

const OnlyMySelector = ({className, children}) => {
    const dispatch = useDispatch()
    const settings = useSelector(userSelector.settings())

    function onChange ({name, value}) {
        dispatch(userAction.updateSettings({...settings, [name]: value}))
    }

    return (
        <CheckboxField
            className={className}
            onChange={onChange}
            value={!!settings.onlyMy}
            name="onlyMy"
        >
            {children || 'Показать только мои данные'}
        </CheckboxField>
    )
}

OnlyMySelector.defaultProps = {
    className: 'mb-4',
}

OnlyMySelector.propTypes = {
    className: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
}

export default OnlyMySelector
