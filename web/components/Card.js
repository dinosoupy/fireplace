import { useRouter } from 'next/navigation'
import { supabase } from '../utils/supabaseClient'
import toast from 'react-hot-toast'

import styles from '../styles/Card.module.css'

const Card = ({ name, url, list, setVideos }) => {
  const router = useRouter()

  const handleDelete = async (name) => {
    const { data: { user } } = await supabase.auth.getUser()

    const reqObject = {
      method: "POST",
      body: JSON.stringify({
        key: `${user.id}/${name}`
      })
    }

    // const promise = deleteFile(id)
    const promise = new Promise( async (resolve, reject) => {
      const { success, err } = await fetch("/api/deleteVideo", reqObject)
      const { data, error } = await supabase
        .from("fireplace-videos")
        .delete()
        .eq("name", name)

      if (err || error) {
        reject()
        throw new Error(err)
      } else {
        const updatedList = list.filter(video => video.name != name)
        setVideos(updatedList)
        resolve()
      }
    })

    toast.promise(promise, {
      success: "Video deleted successfully",
      loading: "Deleting video",
      error: "Could not delete video"
    })
  }

  const handlePlay = async () => {
    window.open(url, '_blank')
  }

  const createWatchparty = async (url) => {
    const { data: { user } } = await supabase.auth.getUser()

    const info = {
      video_url: url,
      creator_id: user.id
    }

    const { data, err } = await supabase
      .from("watchparties")
      .insert([info])
      .select()

    if (err) {
      console.error(err)
    }

    router.push(`/${user.id}/${data[0].id}/create`)
  }

    return (
        <div className={styles.container}>
            <div className={styles.wrapperLeft}>
                <svg 
                    onClick={handlePlay}
                    width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.3418 21.3711C9.71094 21.3711 10.0361 21.2393 10.4404 21.002L20.8203 14.999C21.5762 14.5596 21.8926 14.2168 21.8926 13.6631C21.8926 13.1094 21.5762 12.7754 20.8203 12.3271L10.4404 6.32422C10.0361 6.08691 9.71094 5.95508 9.3418 5.95508C8.62109 5.95508 8.11133 6.50879 8.11133 7.37891V19.9473C8.11133 20.8262 8.62109 21.3711 9.3418 21.3711Z" />
                </svg>
                <h2 className={styles.name}>{name}</h2>
            </div>
            <div className={styles.wrapperRight}>
                <button 
                    onClick={() => createWatchparty(url)}
                    className={styles.button}>
                    Start 
                </button>
                <svg 
                    onClick={() => handleDelete(name)}
                    width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M9.84277 22.4785H18.166C19.3701 22.4785 20.0732 21.8369 20.126 20.6416L20.6797 7.94141H21.8926C22.3408 7.94141 22.6836 7.58984 22.6836 7.15039C22.6836 6.71094 22.332 6.37695 21.8926 6.37695H18.0781V5.05859C18.0781 3.65234 17.1729 2.81738 15.6611 2.81738H12.3213C10.8096 2.81738 9.9043 3.65234 9.9043 5.05859V6.37695H6.10742C5.66797 6.37695 5.31641 6.71973 5.31641 7.15039C5.31641 7.59863 5.66797 7.94141 6.10742 7.94141H7.3291L7.8916 20.6416C7.93555 21.8369 8.63867 22.4785 9.84277 22.4785ZM11.7324 5.1377C11.7324 4.74219 12.0049 4.4873 12.4443 4.4873H15.5469C15.9863 4.4873 16.2588 4.74219 16.2588 5.1377V6.37695H11.7324V5.1377ZM11.1787 19.7803C10.8271 19.7803 10.5811 19.5518 10.5723 19.2002L10.3086 9.86621C10.2998 9.51465 10.5459 9.27734 10.915 9.27734C11.2666 9.27734 11.5127 9.50586 11.5215 9.85742L11.7852 19.1914C11.8027 19.543 11.5566 19.7803 11.1787 19.7803ZM14 19.7803C13.6309 19.7803 13.3848 19.5518 13.3848 19.2002V9.85742C13.3848 9.51465 13.6309 9.27734 14 9.27734C14.3691 9.27734 14.624 9.51465 14.624 9.85742V19.2002C14.624 19.5518 14.3691 19.7803 14 19.7803ZM16.8213 19.7891C16.4434 19.7891 16.1973 19.543 16.2148 19.2002L16.4785 9.85742C16.4873 9.50586 16.7334 9.27734 17.085 9.27734C17.4541 9.27734 17.7002 9.51465 17.6914 9.86621L17.4277 19.2002C17.4189 19.5518 17.1729 19.7891 16.8213 19.7891Z" />
                </svg>
            </div>
        </div>
    )
}

export default Card