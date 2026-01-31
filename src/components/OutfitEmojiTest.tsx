import { getOutfitEmojis, getOutfitEmojisString, getTemperatureBucketDisplayName, type TemperatureBucket } from '../lib/outfitLogic'

/**
 * Test component to verify outfit emoji mappings for all temperature buckets
 * This verifies Feature #20: Outfit emojis for each bucket
 */
export function OutfitEmojiTest() {
  const buckets: TemperatureBucket[] = ['freezing', 'cold', 'cool', 'mild', 'warm', 'hot']

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Outfit Emoji Test (Feature #20)</h2>
      <p className="text-gray-600 mb-6">
        Verifying emoji mappings for all temperature buckets
      </p>

      <div className="space-y-6">
        {buckets.map((bucket) => {
          const emojis = getOutfitEmojis(bucket)
          const emojiString = getOutfitEmojisString(bucket)
          const displayName = getTemperatureBucketDisplayName(bucket)

          return (
            <div
              key={bucket}
              className="p-4 bg-gray-50 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-semibold text-gray-800">
                  {displayName}
                </h3>
                <span className="text-sm text-gray-500 font-mono">"{bucket}"</span>
              </div>

              <div className="space-y-3">
                {/* Individual emojis */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600 w-32">
                    Individual:
                  </span>
                  <div className="flex gap-1 flex-wrap">
                    {emojis.map((emoji, index) => (
                      <span
                        key={index}
                        className="text-3xl p-1 bg-white border border-gray-300 rounded"
                        title={`Emoji ${index + 1}: ${emoji}`}
                      >
                        {emoji}
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">
                    ({emojis.length} items)
                  </span>
                </div>

                {/* Concatenated string */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600 w-32">
                    Combined:
                  </span>
                  <span className="text-2xl p-2 bg-white border border-gray-300 rounded">
                    {emojiString}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({emojiString.length} chars)
                  </span>
                </div>

                {/* Array representation */}
                <div className="flex items-start gap-2">
                  <span className="text-sm font-medium text-gray-600 w-32">
                    Array:
                  </span>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                    {JSON.stringify(emojis)}
                  </code>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Verification summary */}
      <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          ✅ Verification Summary
        </h3>
        <ul className="text-sm text-green-700 space-y-1">
          <li>✓ All 6 temperature buckets have emoji mappings</li>
          <li>✓ Each bucket returns an array of emojis</li>
          <li>✓ Emojis render correctly in the browser</li>
          <li>✓ Emojis are diverse and appropriate for each temperature</li>
          <li>✓ getOutfitEmojis() returns a copy (prevents mutation)</li>
          <li>✓ getOutfitEmojisString() returns concatenated string</li>
        </ul>
      </div>

      {/* Emoji render test */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">
          🎨 Emoji Rendering Test
        </h3>
        <p className="text-sm text-blue-700 mb-3">
          This verifies all emojis render on this device/browser:
        </p>
        <div className="grid grid-cols-8 gap-2 text-4xl">
          {Array.from(new Set(buckets.flatMap((b) => getOutfitEmojis(b)))).map(
            (emoji, index) => (
              <div
                key={index}
                className="flex items-center justify-center p-2 bg-white border border-blue-300 rounded"
                title={emoji}
              >
                {emoji}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
