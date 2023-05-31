function generateAuthError (error) {
    switch (message) {
    case 'INVALID_PASSWORD':
        return 'Неверный E-mail или пароль'
    case 'EMAIL_EXISTS':
        return 'Пользователь с таким email уже существует'
    default:
        return 'Ошибка авторизации'
    }
}

export default generateAuthError