import {ErrorMessage} from "@hookform/error-message";
type TypeFormErrorMessageProps = {
    errors: any
    name: string
}

export default function FormErrorMessage({errors, name} : TypeFormErrorMessageProps){
    return(
        <ErrorMessage
            errors={errors}
            name={name}
            render={({messages}) =>
                messages &&
                Object.entries(messages).map(([type, message]) => (
                    <small className="text-red-500" key={type}>
                        {message}
                    </small>
                ))
            }
        />
    )
}