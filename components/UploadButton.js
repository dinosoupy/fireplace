import React, { useRef } from 'react'
import { supabase } from '../utils/supabaseClient'
import toast from 'react-hot-toast'

import styles from '../styles/UploadButton.module.css'

const UploadButton = ({ flag, setFlag }) => {

    const fileInput = useRef(null)

    const handleClick = () => {
        fileInput.current.click()
    }

    const updateDb = async (fileName) => {
        const { data, error } = await supabase
            .from("fireplace-videos")
            .insert([{
                name: fileName,
                url: `https://d3v6emoc2mddy2.cloudfront.net/${supabase.auth.user().id}/${fileName}`,
                user_id: supabase.auth.user().id
            }])
    }

    const handleFileSelect = async () => {
        const file = fileInput.current.files[0]

        const reqObject = {
            method: "POST",
            body: JSON.stringify({
                userId: supabase.auth.user().id,
                fileName: file.name,
                fileType: file.type
            })
        }

        const promise = new Promise( async (resolve, reject) => {

            const url = await fetch("/api/preSignedURL", reqObject)
                .then(resp => resp.json())
                .then(url => { return url.url })

            const xhr = new XMLHttpRequest()

            xhr.onreadystatechange = async () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        await updateDb(file.name)
                        resolve(xhr)
                        setFlag(!flag)
                    } else {
                        reject(xhr)
                    }
                }
            }
            
            xhr.open("PUT", url)
            xhr.send(file)
        })

        toast.promise(promise, {
            loading: "Uploading file",
            success: "File uploaded",
            error: "Error uploading file"
        })
    }

    return (
        <div 
            className={styles.container}
            onClick={handleClick}
        >
            <svg width="22" height="21" viewBox="0 0 22 21" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 12.9902C11.457 12.9902 11.8262 12.6211 11.8262 12.1816V3.73535L11.7559 2.43457L12.3008 3.07617L13.5312 4.38574C13.6719 4.54395 13.874 4.62305 14.0762 4.62305C14.4805 4.62305 14.8145 4.33301 14.8145 3.91992C14.8145 3.7002 14.7266 3.54199 14.5771 3.39258L11.6328 0.553711C11.4131 0.342773 11.2197 0.272461 11 0.272461C10.7891 0.272461 10.5869 0.342773 10.376 0.553711L7.42285 3.39258C7.27344 3.54199 7.19434 3.7002 7.19434 3.91992C7.19434 4.33301 7.51953 4.62305 7.92383 4.62305C8.12598 4.62305 8.33691 4.54395 8.47754 4.38574L9.69922 3.07617L10.2441 2.42578L10.1826 3.73535V12.1816C10.1826 12.6211 10.5518 12.9902 11 12.9902ZM3.47656 20.9883H18.5146C20.4219 20.9883 21.415 20.0039 21.415 18.123V13.3682C21.415 12.4805 21.3184 12.0586 20.8965 11.4873L18.1016 7.78711C17.0381 6.35449 16.5459 6.06445 14.9639 6.06445H13.4521V7.52344H15.0254C15.6143 7.52344 16.0098 7.64648 16.4492 8.22656L19.332 12.1201C19.6309 12.5156 19.5254 12.6826 19.0771 12.6826H13.8301C13.3203 12.6826 13.0918 13.043 13.0918 13.4209V13.4561C13.0918 14.4844 12.292 15.583 11 15.583C9.70801 15.583 8.9082 14.4844 8.9082 13.4561V13.4209C8.9082 13.043 8.67969 12.6826 8.16992 12.6826H2.92285C2.46582 12.6826 2.38672 12.4893 2.65918 12.1201L5.5332 8.24414C5.98145 7.65527 6.37695 7.52344 6.97461 7.52344H8.54785V6.06445H7.03613C5.44531 6.06445 4.9707 6.35449 3.88086 7.80469L1.09473 11.4873C0.681641 12.0586 0.584961 12.4805 0.584961 13.3682V18.123C0.584961 20.0039 1.57812 20.9883 3.47656 20.9883Z" />
            </svg>
            <input 
                onChange={handleFileSelect}
                className={styles.input} 
                type="file" accept="video/*" hidden 
                ref={fileInput}
            />
        </div>
    )
}

export default UploadButton
