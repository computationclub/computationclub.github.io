## Preamble

After [[last week's productive meeting|Elements of Computing Systems Chapter 7]] working through the arithmetic part of the vm translator, a smaller group of us met to tackle its memory operations. We took a few minutes to re-familiarise ourselves with the chapter and its specification. It was acknowledged that it might not take long and we could spend some time scratching a shared itch for refactoring, at the end.

## Exercises

We began by discussing our approach with regard to testing. We decided to focus on [BasicTest.vm](https://github.com/computationclub/vm-translator/blob/master/spec/acceptance/examples/BasicTest/BasicTest.vm) to begin with. It was noted that until we'd implemented all of its referenced memory operations, we wouldn't see any progress through the integration test. Because of this, we considered writing our own integration tests for each operation. This was rejected in favour of working through the unit tests that Tom had written, but in an order determined by their use in the acceptance test.

> [Chris Patuzzo](https://twitter.com/cpatuzzo): If I were doing TDD, I'd have written my integration test and then I'd have realised I need some units. I'd write my unit tests and then I'd almost totally ignore the integration test at this stage.

After agreeing on our approach, we started working on 'pop local n' as it was the [first unimplemented memory operation in BasicTest](https://github.com/computationclub/vm-translator/blob/master/spec/acceptance/examples/BasicTest/BasicTest.vm#L8). We heavily commented the code to be able to trace what was happening.

> [Tom Stuart](https://twitter.com/tomstuart): I know it's a bit soon to be doing software engineering, but there are essentially two separate modules in this thing we're writing. The first one is 'get a value off the stack' and the next bit is 'write it into the next location in memory'.

Eventually, we found ourselves in a bit of a pickle. The value we wanted to write was stored in Register A and the location to write it to was stored in D. We needed to swap these values and therefore, needed a temporary store. We considered three different approaches:

```
1) Use a general purpose register as the store (R13, R14 or R15)
2) Use the assembler to 'conjure up' a static variable
3) 'Abuse the stack' and use the next stack location as the store
```

We settled on the 'general purpose register' and a few minutes later we had a [working solution](https://github.com/computationclub/vm-translator/commit/39a58f7c6f56603f68538a20ad9e85b39e07b02f).

> [Kevin Butler](https://github.com/Ryman): Does anyone else feel that if we had three registers, all of this stuff would be so easy.

> [Tom Stuart](https://twitter.com/tomstuart): But think of all the extra gates!

Elated by our success, much banter ensued which referenced the technical transcription of [Peer to Peer](http://peertopeer.io/) episodes, [writing a small novela in commit messages](http://lists.lrug.org/pipermail/chat-lrug.org/2014-October/010564.html) and "living for 'git diff noise'". Don't ask.

We steadily continued through ['argument'](https://github.com/computationclub/vm-translator/commit/1c9775c3bbd173cc5f46dd59d3c16ed683c6ee49), ['this'](https://github.com/computationclub/vm-translator/commit/7a678f57d107600ca5fb97c6ecf108c7faf08dda) and ['that'](https://github.com/computationclub/vm-translator/commit/8e4caa1ae2274f3248f2e0119a7d64f78881f010) realising that they were just carbon copies of 'pop local n'. Things got more interesting with the 'temp' memory segment. We noted that this differed in the amount of dereferencing required. We added a special case for ['temp'](https://github.com/computationclub/vm-translator/blob/bad5cb9ca67eb5c65a42f4955b3a0d787e04b714/lib/code_writer.rb#L102-L105) with the intention of refactoring in subsequent commits.

At this point, there was an interesting discussion. Shortened, for brevity:

> [Murray Steele](https://twitter.com/hlame): We've used 'R13', not '13'. Why have we used '5 + offset', not 'R(5 + offset)'? Right now, we know that 'R5' is literally '5', but is that always to be truthy?

> [Tom Stuart](https://twitter.com/tomstuart): The whole point of 'R', is that it's syntactic sugar to make you think that you're accessing a register.

> [Murray Steele](https://twitter.com/hlame): We could replace @LCL with @1. We could replace @ARG with @2, but we haven't. There are symbolic names for a reason. I think we should use [them].

> [Chris Patuzzo](https://twitter.com/cpatuzzo): Aren't we breaking encapsulation if we don't put the 'R' there? The assembler could decide that it's going to store registers in totally different memory addresses.

> [Kevin Butler](https://github.com/Ryman): If the test is relying on that being '5 + i' and then, as Chris says, the specification changes in that 'R' is actually a register rather than a memory location; then, when someone is trusting the specification of '5 + i' and they write to '5 + 2', then that doesn't line up to a register anymore.

> [Leo Cassarani](https://twitter.com/cassarani): I don't think there's a wrong or a right at this point. We're just interpreting the specification in two different ways.

> [Tom Stuart](https://twitter.com/tomstuart): It literally doesn't matter. [...] Personally, I think that where we've got a computed memory location, it makes more sense to think of it as just a number. In other places, where we're referring to [specific registers], it makes more sense to think of it with an 'R' infront.

> [Paul Mucur](https://twitter.com/mudge): I don't think we should get too bogged down. It's definitely something that, in the write-up, will be 'there was contention!'

We got back to work and quickly implemented ['push local n'](https://github.com/computationclub/vm-translator/commit/120c1ba48738862046c32e5ccd71c8a375ef7566). We moved onto the ['pointer' acceptance test](https://github.com/computationclub/vm-translator/blob/master/spec/acceptance/examples/PointerTest/PointerTest.vm) and after an observation from Paul, we [reused the implementation for 'temp'](https://github.com/computationclub/vm-translator/commit/998166d2733836514b3f33211265601314f1c2e4). After that, we worked through the ['static' acceptance test](https://github.com/computationclub/vm-translator/blob/master/spec/acceptance/examples/StaticTest/StaticTest.vm) and Kevin spotted a simplification.

> [Kevin Butler](https://github.com/Ryman): Tom said last time that we don't have a test that changes the filename. So, we could just name our labels 'STATIC' followed by an index.

That's exactly [what we did](https://github.com/computationclub/vm-translator/commit/9a1911fbe33ebcc9f891598293e4e8ad34c0fc00). Thanks, Kevin. We remembered to [close our input stream](https://github.com/computationclub/vm-translator/commit/f1309d8396fe6cb647a7987d69ad28b8d96450d9) and ended up with a green test suite. We waited with bated breath for [travis to pass](https://travis-ci.org/computationclub/vm-translator/builds/56616193) before proceeding to refactor.

> [Tom Stuart](https://twitter.com/tomstuart): We could have just copied the SVG from someone else's.

We spent the rest of the meeting [refactoring](https://github.com/computationclub/vm-translator/commit/44d37b22393d42773402d4419694d039d528fad6). We spent some time discussing naming and replacing a case statement. At the end of the meeting, we ran our vm-translator against one of the acceptance tests and appreciated that our 'programming' produced beautiful skew-whiff output littered with comments. Onwards and upwards!

## Thanks

Thanks again to Leo, for his typey typey and hosting at the Geckoboard offices. Thanks to Tom for his hard work on the [vm-translator project](https://github.com/computationclub/vm-translator) that facilated much of our work.
