import { User } from '../types';

export const Preparing = () => {
    return (
        <div className='my-10'>
            <span className='text-3xl'>講座は終了しました。</span>
            <p className='mt-5'>ご参加いただきありがとうございました。</p>
            <p>今後のイベントもぜひご参加ください。</p>
        </div>
    );
}

export const Loading = () => {
    return (
        <span>Loading...</span>
    );
}

export const Succeeded = (props: User) => {
    return (
        <div className='my-10'>
            <span className='text-3xl text-green-400'>&#x2714;&nbsp;</span>
            <span className='text-3xl'>申し込みを受け付けました！</span>
            <p className='mt-5'>お申込みいただきありがとうございます。</p>
            <p>申込時間の5分前には会場へお越しください。</p>
            <p>ご不明な点がございましたら&ensp;
                <a
                    href='mailto:y-wakuwaku@kumamoto-nct.ac.jp'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    y-wakuwaku@kumamoto-nct.ac.jp
                </a>
                &ensp;までお問い合わせください。
            </p>

            <p className='mt-12'>以下の内容を受け付けました。</p>
            <p>スクリーンショット等で保存されてください。</p>

            <div className='info'>
                <p>お名前: {props.name}</p>
                <p>学年: {props.grade}</p>
                <p>メールアドレス: {props.email}</p>
                <br />
                <p>コース名: {props.title}</p>
                <p>時間帯: {props.schedule}</p>
            </div>
        </div>
    );
}

export const Failed = () => {
    return (
        <div className='my-10'>
            <span className='text-3xl'>送信できませんでした。</span>
            <p className='mt-5'>選択されたコースが定員に達してしまった可能性があります。</p>
            <p>お手数をおかけしますが、通信環境等をご確認の上もう一度お試しください。</p>
            <p>ご不明な点がございましたら&ensp;
                <a
                    href='mailto:y-wakuwaku@kumamoto-nct.ac.jp'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    y-wakuwaku@kumamoto-nct.ac.jp
                </a>
                &ensp;までお問い合わせください。
            </p>
        </div>
    );
}