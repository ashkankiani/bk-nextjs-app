import Head from "next/head";

export default function HeadPage({title}){
    return(
        <Head>
            <title>
                {title + ' | ' + process.env.NEXT_PUBLIC_SITE_NAME}
            </title>
        </Head>
    )
}