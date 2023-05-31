import React from 'react'
import { NavLink } from 'react-router-dom'

function HomeLayout () {
    return (
        <div className="row mt-3 justify-content-center">
            <div className="col-12 col-md-6">
                <h1>Добро пожаловать</h1>
                <p>Значится так. Это приложение создано для того, чтобы записывать сколько ты чего покушал за день и
                    сколько ты после этого весишь. Сможешь создать себе продукты, записать калории, БЖУ, все дела. Потом
                    будешь выбирать продукты, и собирать из них прием пищи. В конце дня встанешь на весы и запишешь
                    сколько весишь</p>
                <p>Нужно оно для контроля самого себя, чтобы потом не особо удивляться цифре на весах. Самоконтроль, так
                    сказать.</p>
                <p>Если ты попал на эту страницу, вероятно ты не зарегистрировался, или, как минимум, не авторизовался.
                    Поэтому жми скорее на одну из кнопок ниже</p>
                <p>Ну что, жремс?</p>
            </div>
            <div className="w-100"></div>
            <div className="col-6 col-md-3 d-flex justify-content-center">
                <NavLink className="btn btn-primary w-100" to="auth/signin">Войти</NavLink>
            </div>
            <div className="col-6 col-md-3 d-flex justify-content-center">
                <NavLink className="btn btn-success w-100" to="auth/signup">Зарегистрироваться</NavLink>
            </div>
        </div>
    )
}

export default HomeLayout
