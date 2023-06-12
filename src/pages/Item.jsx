import { useParams } from "react-router-dom"
import { useContext, useState, useEffect } from "react"
import ContractContext from "../contexts/ContractContext"

const Item = () => {
    const [item, setItem] = useState()
    const [contractInstance, setContractInstance] = useState()

    const { id } = useParams()

    const contract = useContext(ContractContext)

    const getItems = async () => {

        try {
            const item = await contractInstance.items(id);
            console.log(item)
        } catch (error) {
            console.log(error)
        }

        // setItem(item);
    };

    useEffect(() => {
        setContractInstance(contract);

        if (contractInstance) {
            getItems();
        }
    }, [contractInstance]);

    return <h1>Item </h1>
}

export default Item