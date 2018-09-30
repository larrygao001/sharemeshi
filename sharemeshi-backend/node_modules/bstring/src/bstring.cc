/**
 * bstring
 * Copyright (c) 2016, Christopher Jeffrey (MIT License)
 */

#include <stdint.h>
#include <stdlib.h>
#include <string.h>

#include <node.h>
#include <nan.h>

#include "base58.h"
#include "bech32.h"
#include "bstring.h"

NAN_METHOD(base58_encode) {
  if (info.Length() < 1)
    return Nan::ThrowError("base58_encode() requires arguments.");

  v8::Local<v8::Object> buf = info[0].As<v8::Object>();

  if (!node::Buffer::HasInstance(buf))
    return Nan::ThrowTypeError("First argument must be a buffer.");

  const uint8_t *data = (uint8_t *)node::Buffer::Data(buf);
  size_t len = node::Buffer::Length(buf);

  uint8_t *str;
  size_t slen;

  if (!bstring_base58_encode(data, len, &str, &slen))
    return Nan::ThrowError("Base58 encoding failed.");

  info.GetReturnValue().Set(
    Nan::New<v8::String>((char *)str, slen).ToLocalChecked());

  free(str);
}

NAN_METHOD(base58_decode) {
  if (info.Length() < 1)
    return Nan::ThrowError("base58_decode() requires arguments.");

  if (!info[0]->IsString())
    return Nan::ThrowError("First argument must be a string.");

  Nan::Utf8String str_(info[0]);
  const uint8_t *str = (const uint8_t *)*str_;
  size_t len = str_.length();

  uint8_t *data;
  size_t dlen;

  if (!bstring_base58_decode(str, len, &data, &dlen))
    return Nan::ThrowError("Invalid base58 string.");

  info.GetReturnValue().Set(
    Nan::NewBuffer((char *)data, dlen).ToLocalChecked());
}

NAN_METHOD(base58_test) {
  if (info.Length() < 1 || !info[0]->IsString()) {
    info.GetReturnValue().Set(Nan::New<v8::Boolean>(false));
    return;
  }

  Nan::Utf8String str_(info[0]);
  const uint8_t *str = (const uint8_t *)*str_;
  size_t len = str_.length();

  bool result = bstring_base58_test(str, len);

  info.GetReturnValue().Set(Nan::New<v8::Boolean>(result));
}

NAN_METHOD(bech32_encode) {
  if (info.Length() < 3)
    return Nan::ThrowError("bech32_encode() requires arguments.");

  if (!info[0]->IsString())
    return Nan::ThrowError("First argument must be a string.");

  Nan::Utf8String hstr(info[0]);

  if (!info[1]->IsNumber())
    return Nan::ThrowTypeError("Second argument must be a number.");

  v8::Local<v8::Object> wbuf = info[2].As<v8::Object>();

  if (!node::Buffer::HasInstance(wbuf))
    return Nan::ThrowTypeError("Third argument must be a buffer.");

  const char *hrp = (const char *)*hstr;
  int32_t witver = (int32_t)info[1]->Int32Value();

  const uint8_t *witprog = (uint8_t *)node::Buffer::Data(wbuf);
  size_t witprog_len = node::Buffer::Length(wbuf);

  char output[93];
  size_t olen;

  if (!bstring_bech32_encode(output, hrp, witver, witprog, witprog_len))
    return Nan::ThrowError("Bech32 encoding failed.");

  olen = strlen((char *)output);

  info.GetReturnValue().Set(
    Nan::New<v8::String>((char *)output, olen).ToLocalChecked());
}

NAN_METHOD(bech32_decode) {
  if (info.Length() < 2)
    return Nan::ThrowError("bech32_decode() requires arguments.");

  if (!info[0]->IsString())
    return Nan::ThrowError("First argument must be a string.");

  if (!info[1]->IsObject())
    return Nan::ThrowError("Second argument must be an object.");

  Nan::Utf8String addr_(info[0]);
  const char *addr = (const char *)*addr_;

  v8::Local<v8::Object> ret = info[1].As<v8::Object>();

  uint8_t witprog[40];
  size_t witprog_len;
  int witver;
  char hrp[84];
  size_t hlen;

  if (!bstring_bech32_decode(&witver, witprog, &witprog_len, hrp, addr))
    return Nan::ThrowError("Invalid bech32 string.");

  hlen = strlen((char *)&hrp[0]);

  Nan::Set(ret,
    Nan::New<v8::String>("hrp").ToLocalChecked(),
    Nan::New<v8::String>((char *)&hrp[0], hlen).ToLocalChecked());

  Nan::Set(ret,
    Nan::New<v8::String>("version").ToLocalChecked(),
    Nan::New<v8::Number>(witver));

  Nan::Set(ret,
    Nan::New<v8::String>("hash").ToLocalChecked(),
    Nan::CopyBuffer((char *)&witprog[0], witprog_len).ToLocalChecked());

  info.GetReturnValue().Set(ret);
}

NAN_METHOD(bech32_test) {
  if (info.Length() < 1 || !info[0]->IsString()) {
    info.GetReturnValue().Set(Nan::New<v8::Boolean>(false));
    return;
  }

  Nan::Utf8String addr_(info[0]);
  const char *addr = (const char *)*addr_;

  bool result = bstring_bech32_test(addr);

  info.GetReturnValue().Set(Nan::New<v8::Boolean>(result));
}

NAN_MODULE_INIT(init) {
  Nan::Export(target, "base58_encode", base58_encode);
  Nan::Export(target, "base58_decode", base58_decode);
  Nan::Export(target, "base58_test", base58_test);
  Nan::Export(target, "bech32_encode", bech32_encode);
  Nan::Export(target, "bech32_decode", bech32_decode);
  Nan::Export(target, "bech32_test", bech32_test);
}

NODE_MODULE(bstring, init)
