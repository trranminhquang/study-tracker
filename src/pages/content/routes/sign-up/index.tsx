import { APP_ROUTES } from '@common/constants'
import withAuthRedirect from '@hocs/withAuthRedirect'

const SignUpPage = () => {
  return (
    <div>SignUpPage</div>
  )
}

export default withAuthRedirect(SignUpPage, APP_ROUTES.HOME)