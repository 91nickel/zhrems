function generateAuthError (error) {
    switch (message) {
    case 'INVALID_PASSWORD':
        return '�������� E-mail ��� ������'
    case 'EMAIL_EXISTS':
        return '������������ � ����� email ��� ����������'
    default:
        return '������ �����������'
    }
}

export default generateAuthError