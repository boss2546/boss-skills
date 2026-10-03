#!/usr/bin/env python3
"""Interactive Antigravity helper script for Claude Code / Hermes skill.
"""
import sys
import json
import urllib.request
import subprocess

PROXY_HEALTH_URL = "http://127.0.0.1:8080/health"
PROXY_MODELS_URL = "http://127.0.0.1:8080/v1/models"

def check_status():
    print("\n🔍 [1/3] ตรวจสอบสถานะ Antigravity Local Proxy (Port 8080)...")
    try:
        req = urllib.request.urlopen(PROXY_HEALTH_URL, timeout=3)
        if req.status == 200:
            print("  ✅ Antigravity Proxy: กำลังทำงานปกติ (HTTP 200)")
    except Exception as e:
        print(f"  ❌ Antigravity Proxy: มีปัญหา ({e})")

    print("\n🔍 [2/3] ตรวจสอบสถานะ Maymint Voice UI & Watchdog...")
    try:
        res = subprocess.run(["python3", "-c", "import urllib.request; print(urllib.request.urlopen('http://127.0.0.1:8787/health', timeout=3).read().decode())"], capture_output=True, text=True)
        if "ok" in res.stdout.lower() or res.returncode == 0:
            print("  ✅ Maymint Voice UI (Port 8787): กำลังทำงานปกติ")
    except Exception:
        print("  ⚠️ Maymint Voice UI: ไม่พบโปรเซส")

    print("\n🔍 [3/3] ตรวจสอบการเชื่อมต่อ Hermes Agent...")
    try:
        res = subprocess.run(["hermes", "-z", "ตอบสั้นๆ: ok", "--provider", "custom:antigravity", "-m", "gemini-3.6-flash-high"], capture_output=True, text=True, timeout=35)
        if res.returncode == 0 and res.stdout.strip():
            print(f"  ✅ Hermes Response: \"{res.stdout.strip()[:60]}\"")
        else:
            print(f"  ⚠️ Hermes Test Fail: {res.stderr.strip()[:100]}")
    except subprocess.TimeoutExpired:
        print("  ⚠️ Hermes Connection Timeout (35s)")

def list_models():
    print("\n🤖 รายชื่อโมเดลทั้งหมดที่ Antigravity Proxy รองรับ:")
    try:
        req = urllib.request.urlopen(PROXY_MODELS_URL, timeout=5)
        data = json.loads(req.read().decode())
        models = data.get("data", [])
        for i, m in enumerate(models, 1):
            print(f"  {i:2d}. {m.get('id', '')}")
    except Exception as e:
        print(f"  ❌ ไม่สามารถดึงรายชื่อโมเดลได้: {e}")

def check_quota():
    print("\n📊 ตรวจสอบโควต้าและสถานะการใช้งานของแต่ละโมเดล...")
    for model in ["gemini-3.6-flash-high", "gemini-3.1-pro-high", "claude-sonnet-4-6", "claude-opus-4-6-thinking"]:
        print(f"  • {model:26s} -> ", end="", flush=True)
        try:
            res = subprocess.run(
                ["hermes", "-z", "2+2=?", "--provider", "custom:antigravity", "-m", model],
                capture_output=True, text=True, timeout=12
            )
            if res.returncode == 0 and "RESOURCE_EXHAUSTED" not in res.stdout:
                print("✅ พร้อมใช้งาน (Quota OK)")
            elif "RESOURCE_EXHAUSTED" in res.stdout or "RESOURCE_EXHAUSTED" in res.stderr:
                print("❌ Quota หมด (Resource Exhausted)")
            else:
                print("⚠️ มีปัญหา/ตอบสนองช้า")
        except subprocess.TimeoutExpired:
            print("❌ Quota หมด/Timeout (Resource Exhausted)")

def switch_account():
    print("\n🔄 [สลับบัญชีใหม่] Reconnecting สัญญาณระบบกับ Antigravity...")
    try:
        res = subprocess.run(
            ["hermes", "-z", "ตอบสั้นๆ: สลับบัญชีสำเร็จไหม", "--provider", "custom:antigravity", "-m", "gemini-3.6-flash-high"],
            capture_output=True, text=True, timeout=35
        )
        if res.returncode == 0 and res.stdout.strip():
            print(f"  🎉 สำเร็จ! มายตอบกลับว่า: \"{res.stdout.strip()}\"")
            print("  💖 ระบบพร้อมใช้งานต่อเนื่องได้เลยงับบอส!")
        else:
            print(f"  ❌ พบข้อผิดพลาด: {res.stderr.strip() or res.stdout.strip()}")
    except subprocess.TimeoutExpired:
        print("  ⚠️ Reconnect Timeout (35s) — โปรดลองรันซ้ำอีกครั้งงับ")

def main():
    print("============================================================")
    print(" 💖 Antigravity Menu Interactive Assistant")
    print("============================================================")
    print(" [1] 🔍 Check System Status")
    print(" [2] 🤖 List Available Models")
    print(" [3] 📊 Check Model Quotas")
    print(" [4] 🔄 Account Switch & Reconnect")
    
    choice = input("\nกรุณาเลือกหมายเลขฟังก์ชัน (1-4): ").strip()
    if choice == "1":
        check_status()
    elif choice == "2":
        list_models()
    elif choice == "3":
        check_quota()
    elif choice == "4":
        switch_account()
    else:
        print("⚠️ บอสไม่ได้เลือกหมายเลข 1-4 งับ")

if __name__ == "__main__":
    main()
