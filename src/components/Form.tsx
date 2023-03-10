import React, { useState, useEffect } from 'react';

import { Description, FormStatus } from '../types';
import { Preparing, Loading, Succeeded, Failed } from './others';
import { getCapacities, submit } from '../firebase/firebase-modules';

import slimeImg from '../img/スライム.png';
import dnaImg from '../img/DNAストラップ.png';
import magnetImg from '../img/くるくるマグネット.png';
import tankImg from '../img/ふしぎな水そう.png';
import robotImg from '../img/球体ロボット.png';
import accessoryImg from '../img/分解アクセサリー.png';

const initialTitles: string[] = [
  "スライム",
  "DNAストラップ",
  "くるくるマグネット",
  "ふしぎな水そう",
  "球体ロボットでプログラミング体験",
  "電卓を分解して自分だけのアクセサリーを作ろう"
];
const initialSchedules: string[] = [
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00'
];
const initialGrades: string[] = [
  "未就学児",
  "小学校1年",
  "小学校2年",
  "小学校3年",
  "小学校4年",
  "小学校5年",
  "小学校6年",
  "中学校1年",
  "中学校2年",
  "中学校3年",
  "その他"
];

const descriptions: { [key: string]: Description } = {
  "スライム": {
    icon: slimeImg,
    targetAge: "誰でも"
  },
  "DNAストラップ": {
    icon: dnaImg,
    targetAge: "小学4年生以上"
  },
  "くるくるマグネット": {
    icon: magnetImg,
    targetAge: "誰でも"
  },
  "ふしぎな水そう": {
    icon: tankImg,
    targetAge: "誰でも"
  },
  "球体ロボットでプログラミング体験": {
    icon: robotImg,
    targetAge: "小学生以上 ※低学年は保護者同伴"
  },
  "電卓を分解して自分だけのアクセサリーを作ろう": {
    icon: accessoryImg,
    targetAge: "小学4年生以上 ※低学年は保護者同伴であれば受講可"
  }
};

const Form = () => {
  const [formStatus, setStatus] = useState<FormStatus>('closed');

  const [courseTitle, setTitle] = useState<string>(initialTitles[0]);
  const [courseSchedule, setSchedule] = useState<string>(initialSchedules[0]);
  const [userGrade, setGrade] = useState<string>(initialGrades[0]);
  const [userLastName, setLastName] = useState<string>("");
  const [userFirstName, setFirstName] = useState<string>("");
  const [userEmail, setEmail] = useState("");
  const [userMemo, setMemo] = useState("");
  const [capacities, setCapacities] = useState<{ [key: string]: number }>({});
  useEffect(() => {
    const fetchData = async () => {
      const result = await getCapacities(courseTitle);
      setCapacities(result!);
    };
    fetchData();
  }, [courseTitle]);

  const courseButton = (title: string) => {
    const description = descriptions[title];
    return <label className='ml-5 my-4'>
      <input
        type='radio'
        value={title}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
        checked={title === courseTitle}
      />
      <div className='ml-1 -my-1.5'>
        <p className='text-base'>{title}<br /></p>
        <p className='text-sm'>対象年齢: {description.targetAge}</p>
        <img src={description.icon} alt={title} className='w-full' />
      </div>
    </label>;
  };

  const scheduleButton = (schedule: string, capacity: number) => {
    const acceptable = capacity > 0;
    return <label className='ml-5 my-4' style={{ color: (capacity > 1 ? 'black' : 'red') }}>
      <input
        type='radio'
        value={schedule}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSchedule(e.target.value)}
        checked={courseSchedule === schedule}
        disabled={!acceptable}
      />
      <span className='ml-1 -mt-1.5'>
        {schedule}
        {acceptable ? `　残り${capacity}人` : `　申し込みは終了しました`}
      </span>
    </label>;
  };

  const isSubmittable = () => {
    const targets = [userLastName.length, userFirstName.length, userEmail.length, capacities[courseSchedule]];
    return targets.every((n: number) => n > 0);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    const status = await submit(courseTitle, courseSchedule, userGrade, `${userLastName} ${userFirstName}`, userEmail, userMemo);
    setStatus(status);
  };

  const showErrorMessage = () => {
    return isSubmittable()
      ? <div className='pb-6'></div>
      : <span className='caution'>&#9888; 未回答もしくは無効な項目があります。</span>;
  };

  if (formStatus === 'closed') {
    return <Preparing />;
  }
  else if (capacities == null || initialSchedules.some((schedule) => isNaN(capacities[schedule]))) {
    return <Loading />;
  }
  else if (formStatus === 'succeeded') {
    return <Succeeded
      name={`${userLastName} ${userFirstName}`}
      grade={userGrade}
      email={userEmail}
      title={courseTitle}
      schedule={courseSchedule}
    />;
  }
  else if (formStatus === 'failed') {
    return <Failed />;
  }

  return (
    <div>
      <p className='mb-5'>
        「熊本高専わいわい工作わくわく実験ひろば」の当日申し込みフォームです。
        ぜひお友達やご兄弟の方も誘ってご一緒にご参加ください。<br />
        ※講座開始の30分前までにお申し込みください。
      </p>

      <h2 className='title'>1. コース *</h2>
      {initialTitles.map(courseButton)}
      <div className='mb-10' />

      <h2 className='title'>2. 時間帯 *</h2>
      {initialSchedules.map((schedule) => scheduleButton(schedule, capacities[schedule]))}
      <div className='mb-10' />

      <h2 className='title'>3. 学年 *</h2>
      <label className='ml-5 my-3'>
        <select
          className='select-box'
          value={userGrade}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setGrade(e.target.value)}
        >
          {initialGrades.map((grade) => <option value={grade}>{grade}</option>)}
        </select>
      </label>
      <div className='mb-10' />

      <h2 className='title'>4. お名前 *</h2>
      <label className='ml-5 my-3'>
        <input
          className='last-name-box'
          type='text'
          value={userLastName}
          placeholder="高専"
          style={{ width: '49.5%' }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
        />
        <input
          className='first-name-box'
          type='text'
          value={userFirstName}
          placeholder="太郎"
          style={{ width: '49.5%' }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
        />
      </label>
      <div className='mb-10' />

      <h2 className='title'>5. 連絡可能なメールアドレス *</h2>
      <label className='ml-5 my-3'>
        <input
          className='text-box'
          type='email'
          value={userEmail}
          pattern=".+@.+\..+"
          placeholder="xxxxx@example.com"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        />
      </label>
      <div className='mb-10' />

      <h2 className='title'>6. その他</h2>
      <label className='ml-5 my-3'>
        <input
          className='text-box'
          type='text'
          value={userMemo}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMemo(e.target.value)}
        />
      </label>
      <div className='mb-12' />

      <button
        className={isSubmittable() ? 'submit-button' : 'disabled-submit-button'}
        type='button'
        disabled={!isSubmittable()}
        onClick={handleSubmit}
      >
        送信
      </button>

      {showErrorMessage()}
    </div >
  );
}

export default Form;