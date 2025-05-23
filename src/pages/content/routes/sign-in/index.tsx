import { APP_ROUTES } from '@common/constants'
import withAuthRedirect from '@hocs/withAuthRedirect'
import React from 'react'

const SignInPage = () => {
  return (
    <div>SignInPage</div>
  )
}

export default withAuthRedirect(SignInPage, APP_ROUTES.HOME)