import asyncio
import json
import websockets

async def main():
    uri = "ws://localhost:8000/api/ws/1"
    msgs = []
    async with websockets.connect(uri) as ws:
        try:
            while True:
                m = await asyncio.wait_for(ws.recv(), timeout=3)
                msgs.append(json.loads(m))
        except Exception:
            pass
    print(json.dumps(msgs, indent=2))

asyncio.run(main())
