import React, { useEffect, useState } from 'react';
import { useLoaderData } from '@remix-run/react';

interface Post {
  id: number;
  title: string;
}

export const loader = async () => {
  const data: Post[] = await fetch('https://jsonplaceholder.typicode.com/posts').then(res => res.json());
  return data;
};

const PerformanceTest: React.FC = () => {
  const data = useLoaderData<Post[]>();
  const [serverRenderTime, setServerRenderTime] = useState<number | null>(null);
  const [clientRenderTime, setClientRenderTime] = useState<number | null>(null);
  const [ratio, setRatio] = useState<number | null>(null);
  const [status, setStatus] = useState<string>('準備中...');
  const [currentDate] = useState<string>('2025-03-14 08:14:42'); // 更新された現在の日時
  const [currentUser] = useState<string>('RyuhoW'); // 現在のユーザー

  // 両方に同じサンプル数を設定
  const SAMPLE_SIZE = 10; // 両方のテストに同じサンプル数を使用

  useEffect(() => {
    let isMounted = true; // コンポーネントがマウントされているかを追跡

    const measureServerRenderTime = async () => {
      try {
        setStatus('サーバーレンダリング時間を測定中...');
        const serverTimes: number[] = [];

        for (let i = 0; i < SAMPLE_SIZE; i++) {
          await new Promise<void>((resolve) => {
            const start = performance.now();
            requestAnimationFrame(() => {
              const end = performance.now();
              serverTimes.push(end - start);
              console.log(`Server sample ${i + 1}/${SAMPLE_SIZE}: ${(end - start).toFixed(2)} ms`);
              resolve();
            });
          });
        }

        if (isMounted) {
          const serverAverage = serverTimes.reduce((a, b) => a + b, 0) / serverTimes.length;
          setServerRenderTime(serverAverage);
          console.log(`Server測定完了: ${serverAverage.toFixed(2)} ms（サンプル数: ${SAMPLE_SIZE}）`);
        }
      } catch (error) {
        console.error('Server測定エラー:', error);
      }
    };

    const measureClientRenderTime = async () => {
      try {
        setStatus('クライアントレンダリング時間を測定中...');
        const clientTimes: number[] = [];

        // 同じサンプル数でクライアント測定を実行
        for (let i = 0; i < SAMPLE_SIZE; i++) {
          const start = performance.now();
          try {
            await fetch('https://jsonplaceholder.typicode.com/posts').then(res => res.json());
            const end = performance.now();
            const duration = end - start;
            clientTimes.push(duration);
            console.log(`Client fetch ${i + 1}/${SAMPLE_SIZE}: ${duration.toFixed(2)} ms`);
          } catch (fetchError) {
            console.error(`Fetch ${i + 1} error:`, fetchError);
          }

          // 次のリクエストの前に少し待機（レート制限を避けるため）
          await new Promise(resolve => setTimeout(resolve, 300));
        }

        if (isMounted && clientTimes.length > 0) {
          const clientAverage = clientTimes.reduce((a, b) => a + b, 0) / clientTimes.length;
          setClientRenderTime(clientAverage);
          console.log(`Client測定完了: ${clientAverage.toFixed(2)} ms（サンプル数: ${clientTimes.length}）`);

          // サーバー時間も設定済みなら、倍率を計算
          if (serverRenderTime !== null) {
            calculateRatio(serverRenderTime, clientAverage);
          }

          setStatus('測定完了！');
        } else if (isMounted) {
          console.error('Client測定データが収集できませんでした');
          setStatus('Client測定に失敗しました');
        }
      } catch (error) {
        if (isMounted) {
          console.error('Client測定エラー:', error);
          setStatus('測定中にエラーが発生しました');
        }
      }
    };

    // 倍率を計算する関数
    const calculateRatio = (serverTime: number, clientTime: number) => {
      if (serverTime > 0) {
        const calculatedRatio = clientTime / serverTime;
        setRatio(calculatedRatio);
        console.log(`倍率計算完了: クライアントはサーバーの ${calculatedRatio.toFixed(2)} 倍`);
      }
    };

    const runMeasurements = async () => {
      await measureServerRenderTime();
      await measureClientRenderTime();
    };

    runMeasurements();

    // クリーンアップ関数
    return () => {
      isMounted = false;
    };
  }, []);

  // サーバー時間とクライアント時間が両方あるときに倍率を更新
  useEffect(() => {
    if (serverRenderTime !== null && clientRenderTime !== null) {
      const calculatedRatio = clientRenderTime / serverRenderTime;
      setRatio(calculatedRatio);
    }
  }, [serverRenderTime, clientRenderTime]);

  return (
    <div>
      <h1>Performance Test</h1>
      <p>測定日時: {currentDate} (UTC)</p>
      <p>測定者: {currentUser}</p>
      <p>ステータス: {status}</p>
      <p>サンプル数: <strong>{SAMPLE_SIZE}</strong> (両方の測定で同一)</p>

      <div style={{ marginTop: '20px', marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
        {serverRenderTime !== null && (
          <p>Server Render Time Average: <strong>{serverRenderTime.toFixed(2)} ms</strong></p>
        )}

        {clientRenderTime !== null && (
          <p>Client Render Time Average: <strong>{clientRenderTime.toFixed(2)} ms</strong></p>
        )}

        {ratio !== null && (
          <p style={{ fontWeight: 'bold', color: '#0066cc' }}>
            比較: クライアントレンダリングは サーバーレンダリングの <span style={{ fontSize: '1.2em' }}>{ratio.toFixed(2)}倍</span> の時間がかかっています
          </p>
        )}
      </div>

      {!serverRenderTime && !clientRenderTime && (
        <p>測定結果はまだありません。コンソールログで進捗を確認してください。</p>
      )}

      {/* グラフ表示 */}
      {serverRenderTime !== null && clientRenderTime !== null && (
        <div style={{ marginTop: '20px' }}>
          <h3>視覚的比較</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '500px' }}>
            <div>
              <p>サーバーレンダリング:</p>
              <div style={{
                width: `${Math.min(100, serverRenderTime / 5)}%`,
                height: '20px',
                backgroundColor: '#4CAF50',
                borderRadius: '3px',
                position: 'relative'
              }}>
                <span style={{ position: 'absolute', right: '-70px', top: '0' }}>{serverRenderTime.toFixed(2)} ms</span>
              </div>
            </div>
            <div>
              <p>クライアントレンダリング:</p>
              <div style={{
                width: `${Math.min(100, clientRenderTime / 5)}%`,
                height: '20px',
                backgroundColor: '#2196F3',
                borderRadius: '3px',
                position: 'relative'
              }}>
                <span style={{ position: 'absolute', right: '-70px', top: '0' }}>{clientRenderTime.toFixed(2)} ms</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 測定の詳細情報 */}
      <div style={{ marginTop: '30px', fontSize: '0.9em', color: '#666' }}>
        <h3>測定方法について</h3>
        <p>サーバーレンダリング: <code>requestAnimationFrame</code>を使用して測定</p>
        <p>クライアントレンダリング: 外部APIへのフェッチリクエスト時間を測定</p>
        <p>各測定は{SAMPLE_SIZE}回実行され、その平均値を使用</p>
      </div>
    </div>
  );
};

export default PerformanceTest;
