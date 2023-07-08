import React from 'react'
import PropTypes from 'prop-types'
import { useSettings } from 'hooks/useSettings'
import CheckboxField from 'components/common/form/checkboxField'

const OnlyMySelector = ({className, children}) => {
    const {settings, updateSettings} = useSettings()

    return (
        <CheckboxField
            className={className}
            onChange={updateSettings}
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
