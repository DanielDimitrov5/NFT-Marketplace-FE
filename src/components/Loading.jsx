import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum } from "@fortawesome/free-brands-svg-icons"

const Loading = () => {
    return (
        <div className="text-center">
            <FontAwesomeIcon icon={faEthereum} spin size="2xl" />
        </div>
    )
}

export default Loading;